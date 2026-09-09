import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { X, FileSpreadsheet, Check, AlertCircle, ArrowRight, Layers, Trash2, Globe, Download, Loader2, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface BatchImportModalProps {
  existingCategories: Category[];
  currency: string;
  onClose: () => void;
  onImport: (newProducts: Product[], newCategories: Category[], mode: 'append' | 'replace') => void;
}

interface ParsedRow {
  id: string;
  name: string;
  price: number;
  categoryName: string;
  description: string;
  valid: boolean;
  error?: string;
}

const QUICK_CATEGORIES = [
  { name: 'Catering', slug: 'catering', url: 'https://guateque-manduca.ola.click/catering', icon: '🍖' },
  { name: 'Box de Viandas', slug: 'box-de-viandas-super-precios', url: 'https://guateque-manduca.ola.click/box-de-viandas-super-precios', icon: '🍱' },
  { name: 'Viandas al Vacío', slug: 'viandas-envasadas-al-vacio', url: 'https://guateque-manduca.ola.click/viandas-envasadas-al-vacio', icon: '🍲' },
  { name: 'Menú Ejecutivo', slug: 'menu-ejecutivo', url: 'https://guateque-manduca.ola.click/menu-ejecutivo', icon: '🍽️' },
  { name: 'Guarniciones', slug: 'guarniciones', url: 'https://guateque-manduca.ola.click/guarniciones', icon: '🥔' },
];

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  existingCategories,
  currency,
  onClose,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'olaclick' | 'sheets'>('olaclick');

  // Ola Click State
  const [olaUrl, setOlaUrl] = useState('https://guateque-manduca.ola.click/catering');
  const [isLoadingOla, setIsLoadingOla] = useState(false);
  const [olaResult, setOlaResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  // Sheets State
  const [rawText, setRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [hasHeader, setHasHeader] = useState(true);
  const [step, setStep] = useState<'paste' | 'preview'>('paste');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');

  // Column mapping indices (default guess)
  const [nameCol, setNameCol] = useState<number>(0);
  const [priceCol, setPriceCol] = useState<number>(1);
  const [categoryCol, setCategoryCol] = useState<number>(2);
  const [descCol, setDescCol] = useState<number>(3);

  const cleanPrice = (val: string): number => {
    if (!val) return 0;
    let cleaned = val.replace(/[\$\s\.]/g, '').replace(',', '.');
    if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(val.trim())) {
      cleaned = val.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
    } else if (val.includes(',') && !val.includes('.')) {
      cleaned = val.replace(',', '.').replace(/[^\d.]/g, '');
    } else {
      cleaned = val.replace(/[^\d.]/g, '');
    }
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const handleImportOlaClick = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || olaUrl;
    if (!targetUrl.trim()) return;

    setIsLoadingOla(true);
    setOlaResult(null);

    try {
      const res = await fetch('/api/import-olaclick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, mode: 'append' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al importar desde Ola Click');
      }

      setOlaResult({
        success: true,
        message: `¡Importados con éxito ${data.productsCount} productos con fotos, variantes y salsas a "${data.category.name}"!`,
        count: data.productsCount,
      });

      // Notify parent to append to local state
      onImport(data.products, [data.category], 'append');
    } catch (err: any) {
      setOlaResult({
        success: false,
        message: err.message || 'Error al conectar con Ola Click',
      });
    } finally {
      setIsLoadingOla(false);
    }
  };

  const parseData = () => {
    if (!rawText.trim()) return;

    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const firstLine = lines[0];
    let delimiter = '\t';
    if (firstLine.includes('\t')) {
      delimiter = '\t';
    } else if (firstLine.includes(';') && !firstLine.includes('\t')) {
      delimiter = ';';
    } else if (firstLine.includes(',') && !firstLine.includes('\t')) {
      delimiter = ',';
    }

    const startIdx = hasHeader ? 1 : 0;
    const rowsToParse = lines.slice(startIdx);

    const results: ParsedRow[] = rowsToParse.map((line, idx) => {
      const cols = line.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim());

      const name = cols[nameCol] || cols[0] || '';
      const priceRaw = cols[priceCol] !== undefined ? cols[priceCol] : cols[1] || '0';
      const categoryName = cols[categoryCol] !== undefined ? cols[categoryCol] : cols[2] || 'General';
      const description = cols[descCol] !== undefined ? cols[descCol] : cols[3] || '';

      const price = cleanPrice(priceRaw);
      const valid = name.length > 0;

      return {
        id: `row_${Date.now()}_${idx}`,
        name,
        price,
        categoryName: categoryName || 'General',
        description,
        valid,
        error: !valid ? 'Falta el nombre del producto' : undefined,
      };
    });

    setParsedRows(results);
    setStep('preview');
  };

  const handleConfirmImport = () => {
    const validRows = parsedRows.filter((r) => r.valid);
    if (validRows.length === 0) return;

    const categoryMap = new Map<string, string>();
    existingCategories.forEach((cat) => {
      categoryMap.set(cat.name.toLowerCase().trim(), cat.id);
    });

    const newCategories: Category[] = [...existingCategories];

    validRows.forEach((r) => {
      const normalizedName = r.categoryName.toLowerCase().trim();
      if (!categoryMap.has(normalizedName)) {
        const newId = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        categoryMap.set(normalizedName, newId);
        newCategories.push({
          id: newId,
          name: r.categoryName.trim(),
          order: newCategories.length + 1,
          isVisible: true,
        });
      }
    });

    const newProducts: Product[] = validRows.map((r, idx) => {
      const catId = categoryMap.get(r.categoryName.toLowerCase().trim()) || existingCategories[0]?.id || 'cat_general';
      return {
        id: `prod_${Date.now()}_${idx}`,
        name: r.name,
        description: r.description,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        categoryIds: [catId],
        priceType: 'simple',
        simplePrice: r.price,
        variants: [],
        modifierGroupIds: [],
        isDiscontinued: false,
        isHidden: false,
        order: idx + 1,
      };
    });

    onImport(newProducts, newCategories, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              {activeTab === 'olaclick' ? <Globe className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Importar Productos al Catálogo
              </h3>
              <p className="text-[11px] text-neutral-400">
                Desde tu tienda en Ola Click o pegando datos desde Google Sheets / Excel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 px-4 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('olaclick')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'olaclick'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Enlace de Ola Click</span>
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Sheets / Excel</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'olaclick' ? (
            <div className="space-y-5">
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-xl text-xs text-emerald-200 leading-relaxed">
                <strong>✨ Importación Automática desde Ola Click:</strong>
                <p className="mt-1 text-neutral-300 text-[11px]">
                  Copia el enlace de cualquier categoría de tu tienda Ola Click y pégalo abajo. Descargará automáticamente los <strong>nombres</strong>, <strong>fotos en alta resolución</strong>, <strong>descripciones</strong>, <strong>precios</strong>, <strong>variantes</strong> (ej. 30, 50, 80 sanguchitos) y <strong>grupos de salsas/extras</strong> con sus límites de selección.
                </p>
              </div>

              {/* Quick Category Buttons */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  Categorías de Guateque Manduca (1 clic para cargar):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUICK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => {
                        setOlaUrl(cat.url);
                        handleImportOlaClick(cat.url);
                      }}
                      disabled={isLoadingOla}
                      className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 rounded-xl text-left transition-all group cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-white group-hover:text-emerald-400">
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 truncate block mt-0.5 font-mono">
                        /{cat.slug}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 block">
                  O pega cualquier enlace de categoría de Ola Click:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={olaUrl}
                    onChange={(e) => setOlaUrl(e.target.value)}
                    placeholder="https://guateque-manduca.ola.click/catering"
                    className="flex-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    onClick={() => handleImportOlaClick()}
                    disabled={isLoadingOla || !olaUrl.trim()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {isLoadingOla ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Importando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Importar Enlace</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {olaResult && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    olaResult.success
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                      : 'bg-red-950/40 border-red-800 text-red-200'
                  }`}
                >
                  {olaResult.success ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block mb-0.5">
                      {olaResult.success ? '¡Listo!' : 'Hubo un inconveniente'}
                    </strong>
                    <span>{olaResult.message}</span>
                  </div>
                </div>
              )}
            </div>
          ) : step === 'paste' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-950/30 border border-blue-800/50 rounded-xl text-xs text-blue-200 leading-relaxed">
                <strong>💡 ¿Cómo usarlo?:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-neutral-300 text-[11px]">
                  <li>Abre tu pestaña de Google Sheets o Excel.</li>
                  <li>Selecciona las columnas (ej: <strong>Nombre | Precio | Categoría | Descripción</strong>).</li>
                  <li>Copia con <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-white font-mono">Ctrl + C</kbd>.</li>
                  <li>Haz clic en el recuadro de abajo y pega con <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-white font-mono">Ctrl + V</kbd>.</li>
                </ol>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Pega aquí los datos copiados de Google Sheets:
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasHeader}
                      onChange={(e) => setHasHeader(e.target.checked)}
                      className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer"
                    />
                    <span>La primera fila contiene los títulos / encabezados</span>
                  </label>
                </div>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`Ejemplo de lo que pegas:\nPlato / Producto\tPrecio\tCategoría\tDescripción\nPernil de Cerdo\t80000\tCatering\tRinde 30 sanguchitos con salsas\nMilanesa Napolitana\t9800\tMenú Ejecutivo\tCon papas fritas\nDocena de Empanadas\t17200\tCatering\tCarne suave cortada a cuchillo`}
                  className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 whitespace-pre"
                />
              </div>

              {/* Column order mapping */}
              <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2">
                <span className="text-xs font-semibold text-neutral-400 block">
                  Orden de columnas en tu hoja de cálculo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Columna Nombre:</label>
                    <select
                      value={nameCol}
                      onChange={(e) => setNameCol(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-xs"
                    >
                      <option value={0}>Columna 1 (A)</option>
                      <option value={1}>Columna 2 (B)</option>
                      <option value={2}>Columna 3 (C)</option>
                      <option value={3}>Columna 4 (D)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Columna Precio:</label>
                    <select
                      value={priceCol}
                      onChange={(e) => setPriceCol(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-xs"
                    >
                      <option value={1}>Columna 2 (B)</option>
                      <option value={0}>Columna 1 (A)</option>
                      <option value={2}>Columna 3 (C)</option>
                      <option value={3}>Columna 4 (D)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Columna Categoría:</label>
                    <select
                      value={categoryCol}
                      onChange={(e) => setCategoryCol(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-xs"
                    >
                      <option value={2}>Columna 3 (C)</option>
                      <option value={0}>Columna 1 (A)</option>
                      <option value={1}>Columna 2 (B)</option>
                      <option value={3}>Columna 4 (D)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Columna Descripción:</label>
                    <select
                      value={descCol}
                      onChange={(e) => setDescCol(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-xs"
                    >
                      <option value={3}>Columna 4 (D)</option>
                      <option value={0}>Columna 1 (A)</option>
                      <option value={1}>Columna 2 (B)</option>
                      <option value={2}>Columna 3 (C)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PREVIEW STEP */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {parsedRows.filter((r) => r.valid).length} productos listos para importar
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Las categorías que no existan se crearán automáticamente.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="accent-blue-600"
                    />
                    <span>Sumar a los actuales</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="accent-amber-500"
                    />
                    <span className="text-amber-300">Reemplazar catálogo</span>
                  </label>
                </div>
              </div>

              {/* Table preview */}
              <div className="border border-neutral-800 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 sticky top-0">
                    <tr>
                      <th className="p-2.5">Producto</th>
                      <th className="p-2.5">Precio</th>
                      <th className="p-2.5">Categoría</th>
                      <th className="p-2.5">Descripción</th>
                      <th className="p-2.5 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {parsedRows.map((row) => (
                      <tr
                        key={row.id}
                        className={row.valid ? 'hover:bg-neutral-800/40' : 'bg-red-950/20 text-red-300'}
                      >
                        <td className="p-2.5 font-semibold text-white">{row.name || '(Sin nombre)'}</td>
                        <td className="p-2.5 font-mono text-emerald-400">
                          {formatPrice(row.price, currency)}
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-300">
                            {row.categoryName}
                          </span>
                        </td>
                        <td className="p-2.5 text-neutral-400 max-w-xs truncate">
                          {row.description || '—'}
                        </td>
                        <td className="p-2.5 text-center">
                          {row.valid ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400 mx-auto" title={row.error} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950/80 shrink-0">
          {activeTab === 'sheets' && step === 'preview' ? (
            <button
              onClick={() => setStep('paste')}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 cursor-pointer"
            >
              Volver a editar texto
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 cursor-pointer"
            >
              Cerrar
            </button>
          )}

          {activeTab === 'sheets' && (
            step === 'paste' ? (
              <button
                onClick={parseData}
                disabled={!rawText.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>Vista Previa de Productos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Importar {parsedRows.filter((r) => r.valid).length} Productos</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
