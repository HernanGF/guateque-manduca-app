import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_MENU_DATA } from './src/initialData';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'menu.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadMenuData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  // Initialize with seed
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_MENU_DATA, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial data file:', err);
  }
  return INITIAL_MENU_DATA;
}

function saveMenuData(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving data:', err);
    return false;
  }
}

// API Routes
app.get('/api/menu', (req, res) => {
  const data = loadMenuData();
  res.json(data);
});

app.put('/api/menu', (req, res) => {
  const newData = req.body;
  if (!newData || !newData.business || !Array.isArray(newData.products)) {
    return res.status(400).json({ error: 'Datos de menú inválidos' });
  }
  const success = saveMenuData(newData);
  if (success) {
    res.json({ success: true, message: 'Menú actualizado correctamente' });
  } else {
    res.status(500).json({ error: 'No se pudo guardar la información' });
  }
});

// Import category from Ola Click URL
app.post('/api/import-olaclick', async (req, res) => {
  try {
    const { url, mode = 'append' } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Debes proporcionar una URL de Ola Click' });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    // Clean query parameters for fetching
    const parsed = new URL(targetUrl);
    const pathname = parsed.pathname.replace(/\/+$/, '');
    const cleanFetchUrl = `${parsed.protocol}//${parsed.host}${pathname}`;

    const response = await fetch(cleanFetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return res.status(400).json({ error: `No se pudo conectar a Ola Click (código ${response.status})` });
    }

    const html = await response.text();
    const match = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) {
      return res.status(400).json({ error: 'No se pudieron extraer datos de la página de Ola Click' });
    }

    const raw = JSON.parse(match[1]);

    const seen = new Map();
    function unflatten(idx: unknown): any {
      if (typeof idx !== 'number') return idx;
      if (seen.has(idx)) return seen.get(idx);
      const val = raw[idx];
      if (val === null || typeof val !== 'object') return val;
      if (Array.isArray(val)) {
        const arr: any[] = [];
        seen.set(idx, arr);
        for (const item of val) arr.push(unflatten(item));
        return arr;
      }
      const obj: Record<string, any> = {};
      seen.set(idx, obj);
      for (const k in val) obj[k] = unflatten(val[k]);
      return obj;
    }

    const cat = unflatten(4);
    if (!cat || !cat.name) {
      return res.status(400).json({ error: 'No se detectó una categoría válida en el enlace' });
    }

    const categoryId = `cat_${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const categoryName = cat.name;

    const currentMenu = loadMenuData();
    const modifierGroupsMap = new Map();
    (currentMenu.modifierGroups || []).forEach((mg: any) => modifierGroupsMap.set(mg.id, mg));

    const importedProducts: any[] = [];

    (cat.products || []).forEach((p: any, idx: number) => {
      const modifierGroupIds: string[] = [];

      if (p.modifier_categories && Array.isArray(p.modifier_categories)) {
        p.modifier_categories.forEach((mc: any) => {
          const groupId = `mod_${mc.id || mc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
          modifierGroupIds.push(groupId);

          const isRequired = !!mc.required;
          const isMultiple = mc.type === 'many' || !!mc.multiple || (mc.max_modifiers > 1);

          modifierGroupsMap.set(groupId, {
            id: groupId,
            name: mc.name,
            condition: isRequired ? 'required' : 'optional',
            selectionType: isMultiple ? 'multiple' : 'single',
            minSelect: mc.min_modifiers !== undefined ? mc.min_modifiers : (isRequired ? 1 : 0),
            maxSelect: mc.max_modifiers !== undefined ? mc.max_modifiers : (isMultiple ? (mc.modifiers?.length || 10) : 1),
            options: (mc.modifiers || []).map((m: any) => ({
              id: `opt_${m.id || m.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
              name: m.name,
              price: Number(m.price || 0),
              isVisible: true,
            })),
          });
        });
      }

      const variants = (p.product_variants || []).map((v: any) => ({
        id: `var_${v.id}`,
        name: v.name || 'Porción',
        price: Number(v.price || 0),
        isVisible: true,
      }));

      let priceType = 'simple';
      let simplePrice = 0;
      if (variants.length > 1) {
        priceType = 'variants';
        simplePrice = variants[0]?.price || 0;
      } else if (variants.length === 1) {
        priceType = 'simple';
        simplePrice = variants[0]?.price || 0;
      }

      const imageUrl = p.images?.[0]?.image_url || '';

      importedProducts.push({
        id: `prod_${p.id}`,
        name: p.name,
        description: p.description || '',
        imageUrl,
        categoryIds: [categoryId],
        priceType,
        simplePrice,
        variants,
        modifierGroupIds,
        isDiscontinued: !p.visible,
        isHidden: false,
        isFeatured: idx < 2,
        order: idx + 1,
      });
    });

    // Update categories list
    let catEntry = currentMenu.categories.find((c: any) => c.id === categoryId);
    if (!catEntry) {
      catEntry = {
        id: categoryId,
        name: categoryName,
        order: currentMenu.categories.length + 1,
        isVisible: true,
      };
      currentMenu.categories.push(catEntry);
    } else {
      catEntry.name = categoryName;
      catEntry.isVisible = true;
    }

    // Merge or replace products
    if (mode === 'replace') {
      currentMenu.products = importedProducts;
    } else {
      // Remove old items from this same category before appending new ones
      const withoutCat = currentMenu.products.filter((p: any) => !p.categoryIds.includes(categoryId));
      currentMenu.products = [...withoutCat, ...importedProducts];
    }

    currentMenu.modifierGroups = Array.from(modifierGroupsMap.values());

    saveMenuData(currentMenu);

    res.json({
      success: true,
      category: catEntry,
      productsCount: importedProducts.length,
      products: importedProducts,
      menu: currentMenu,
    });
  } catch (err: any) {
    console.error('Error importing from Ola Click:', err);
    res.status(500).json({ error: err.message || 'Error al procesar la importación' });
  }
});

app.post('/api/reset', (req, res) => {
  saveMenuData(INITIAL_MENU_DATA);
  res.json(INITIAL_MENU_DATA);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
