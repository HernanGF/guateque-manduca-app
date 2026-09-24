import fs from 'fs';
import path from 'path';
import { MenuData } from '../src/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');
const INITIAL_DATA_FILE = path.join(process.cwd(), 'src', 'initialData.ts');

function prepareDatabase() {
  console.log('🔄 Preparando base de datos para push...');

  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`No se encontró el archivo de datos en: ${DATA_FILE}`);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const menu: MenuData = JSON.parse(raw);

  // 1. Sanitize and validate
  if (!menu.business || !Array.isArray(menu.categories) || !Array.isArray(menu.products)) {
    throw new Error('Estructura de menú inválida en data/menu.json');
  }

  // Ensure categories are sorted by order
  menu.categories.sort((a, b) => (a.order || 0) - (b.order || 0));

  // Category map for validation
  const validCatIds = new Set(menu.categories.map((c) => c.id));

  // Sanitize products
  menu.products.forEach((p) => {
    // Filter out invalid category IDs if any
    p.categoryIds = p.categoryIds.filter((cid) => validCatIds.has(cid));
    if (p.categoryIds.length === 0 && menu.categories.length > 0) {
      p.categoryIds = [menu.categories[0].id];
    }

    // Ensure price numbers are valid
    if (typeof p.simplePrice !== 'number' || isNaN(p.simplePrice)) {
      p.simplePrice = 0;
    }

    if (Array.isArray(p.variants)) {
      p.variants.forEach((v) => {
        if (typeof v.price !== 'number' || isNaN(v.price)) {
          v.price = 0;
        }
      });
    }
  });

  // 2. Set new updatedAt timestamp
  const now = Date.now();
  menu.updatedAt = now;

  // 3. Save to data/menu.json
  const formattedJson = JSON.stringify(menu, null, 2);
  fs.writeFileSync(DATA_FILE, formattedJson, 'utf-8');
  console.log(`✅ data/menu.json actualizado con éxito (timestamp: ${now}).`);

  // 4. Save to src/initialData.ts
  const tsContent = `import { MenuData } from "./types";\n\nexport const INITIAL_MENU_DATA: MenuData = ${formattedJson};\n`;
  fs.writeFileSync(INITIAL_DATA_FILE, tsContent, 'utf-8');
  console.log(`✅ src/initialData.ts sincronizado con éxito para despliegue estático/Vercel.`);

  // 5. Summary
  console.log('\n📊 Resumen de la base de datos:');
  console.log(`- Negocio: ${menu.business.name} (WhatsApp: ${menu.business.whatsappPhone})`);
  console.log(`- Categorías activas: ${menu.categories.length}`);
  menu.categories.forEach((cat) => {
    const prods = menu.products.filter((p) => p.categoryIds.includes(cat.id));
    console.log(`  • [${cat.order}] ${cat.name}: ${prods.length} productos`);
  });
  console.log(`- Total de productos: ${menu.products.length}`);
  console.log(`- Grupos de modificadores/adicionales: ${(menu.modifierGroups || []).length}`);
  console.log('\n🚀 La base de datos está lista y verificada para hacer push a tu repositorio.');
}

try {
  prepareDatabase();
} catch (err: any) {
  console.error('❌ Error al preparar la base de datos:', err.message || err);
  process.exit(1);
}
