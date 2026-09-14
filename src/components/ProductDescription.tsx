import React from 'react';
import { Package, Info } from 'lucide-react';

export interface ParsedDescription {
  isList: boolean;
  mainText: string;
  items: string[];
  footerNote?: string;
  raw: string;
}

/**
 * Checks whether a product belongs to the Catering category.
 */
export function isCateringProduct(
  productOrCategoryIds: { categoryIds?: string[] } | string[] | undefined,
  categories?: { id: string; name: string }[]
): boolean {
  if (!productOrCategoryIds) return false;
  const categoryIds = Array.isArray(productOrCategoryIds)
    ? productOrCategoryIds
    : productOrCategoryIds.categoryIds || [];

  return categoryIds.some((cid) => {
    if (!cid) return false;
    const cidLower = cid.toLowerCase();
    if (cidLower.includes('catering')) return true;
    const cat = categories?.find((c) => c.id === cid);
    return !!cat?.name.toLowerCase().includes('catering');
  });
}

/**
 * Parses a product description into structured items, main text, and footer storage note.
 * Unless it is in Catering, all products get the footerNote: "Producto envasado al vacío y congelado."
 * instead of displaying it inside the main text paragraph.
 */
export function parseProductDescription(
  desc: string | undefined,
  isCatering: boolean = false
): ParsedDescription {
  const raw = desc?.trim() || '';

  const defaultStorageNote = 'Producto envasado al vacío y congelado.';

  // Strip inline occurrences of "Producto envasado al vacío y congelado" from main text
  let cleaned = raw
    .replace(/(?:\.?\s*)?(?:productos?|producto)\s+envasados?\s+al\s+vac[ií]o\s+y\s+congelados?\.?/gi, '')
    .trim();

  // Clean trailing punctuation if left awkward
  cleaned = cleaned.replace(/[,\s]+$/, '');

  // 1. Check if it has explicit newlines
  let rawLines = cleaned
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // If only 1 line, check if it has multiple numbered items on one line,
  // e.g. "1 Tarta de Acelga 1 Tarta de Pollo 1 Tortilla" or bullet-separated
  if (rawLines.length <= 1 && cleaned.length > 0) {
    if (cleaned.includes('•')) {
      const parts = cleaned.split('•').map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        rawLines = parts;
      }
    } else {
      const matches = [...cleaned.matchAll(/(?:^|[,;]|\s{2,})((\d+)\s+[A-ZÁÉÍÓÚÑ][^,;\n]+)/gi)];
      if (matches.length >= 2) {
        rawLines = matches.map((m) => m[1].trim());
      }
    }
  }

  // Determine if it is a multi-item list (like Boxes de viandas)
  const isList = rawLines.length >= 2;

  // Extract items or main text
  const items: string[] = isList ? rawLines : [];
  const mainText = isList ? '' : cleaned;

  // Set footerNote:
  // If catering, no vacuum/frozen note.
  // If not catering, ALWAYS include the vacuum/frozen note!
  let footerNote: string | undefined = undefined;
  if (!isCatering) {
    footerNote = defaultStorageNote;
  }

  return {
    isList,
    mainText,
    items,
    footerNote,
    raw,
  };
}

interface ProductDescriptionProps {
  description?: string;
  isCatering?: boolean;
  mode?: 'card-grid' | 'card-list' | 'modal' | 'admin';
  className?: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  isCatering = false,
  mode = 'card-grid',
  className = '',
}) => {
  const parsed = parseProductDescription(description, isCatering);

  if (!parsed.raw && !parsed.footerNote) {
    return null;
  }

  // --- 1. MODAL VIEW (Rich, spacious, with quantity badges and separate storage note) ---
  if (mode === 'modal') {
    if (!parsed.isList) {
      return (
        <div className={`mt-2 ${className}`}>
          {parsed.mainText && (
            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-normal whitespace-pre-line">
              {parsed.mainText}
            </p>
          )}

          {parsed.footerNote && (
            <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex items-center gap-2.5 text-sm sm:text-base text-neutral-300">
              <span className="text-sky-400 text-base shrink-0">❄️</span>
              <span className="italic font-medium">{parsed.footerNote}</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`mt-3 bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-5 space-y-3.5 ${className}`}>
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Package className="w-4.5 h-4.5 text-amber-400 shrink-0" />
            <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              Contenido del Box
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {parsed.items.length} viandas incluidas
          </span>
        </div>

        <ul className="space-y-2">
          {parsed.items.map((item, idx) => {
            const match = item.match(/^(\d+)\s+(.+)$/);
            const qty = match ? match[1] : null;
            const name = match ? match[2] : item;

            return (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/60 hover:border-neutral-700/80 transition-colors"
              >
                {qty ? (
                  <span
                    className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-amber-500 text-neutral-950 font-black text-sm shrink-0 shadow-sm"
                    title={`Cantidad: ${qty}`}
                  >
                    {qty}
                  </span>
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                )}
                <span className="text-base font-medium text-neutral-100 leading-snug pt-0.5">
                  {name}
                </span>
              </li>
            );
          })}
        </ul>

        {parsed.footerNote && (
          <div className="pt-2.5 border-t border-neutral-800/80 flex items-center gap-2.5 text-sm text-neutral-300">
            <span className="text-sky-400 text-base shrink-0">❄️</span>
            <span className="italic font-medium leading-relaxed">{parsed.footerNote}</span>
          </div>
        )}
      </div>
    );
  }

  // --- 2. CARD GRID VIEW (Clean vertical list, max readability) ---
  if (mode === 'card-grid') {
    if (!parsed.isList) {
      return (
        <div className={`mt-1.5 ${className}`}>
          {parsed.mainText && (
            <p className="text-sm sm:text-base text-neutral-300 line-clamp-2 leading-relaxed font-normal">
              {parsed.mainText}
            </p>
          )}

          {parsed.footerNote && (
            <div className="pt-1.5 border-t border-neutral-800/60 mt-2 flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400">
              <span className="text-sky-400 text-sm shrink-0">❄️</span>
              <span className="italic truncate">{parsed.footerNote}</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`mt-2 space-y-1.5 ${className}`}>
        <div className="space-y-1">
          {parsed.items.map((item, idx) => {
            const match = item.match(/^(\d+)\s+(.+)$/);
            const qty = match ? match[1] : null;
            const name = match ? match[2] : item;

            return (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-200">
                {qty ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black text-xs shrink-0 mt-0.5">
                    {qty}
                  </span>
                ) : (
                  <span className="text-amber-500 font-bold shrink-0 leading-tight">•</span>
                )}
                <span className="leading-tight line-clamp-1">{name}</span>
              </div>
            );
          })}
        </div>

        {parsed.footerNote && (
          <div className="pt-1.5 border-t border-neutral-800/60 mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400">
            <span className="text-sky-400 text-sm shrink-0">❄️</span>
            <span className="italic truncate">{parsed.footerNote}</span>
          </div>
        )}
      </div>
    );
  }

  // --- 3. CARD LIST VIEW (Spacious horizontal layout) ---
  if (mode === 'card-list') {
    if (!parsed.isList) {
      return (
        <div className={`mt-2 ${className}`}>
          {parsed.mainText && (
            <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 leading-relaxed font-normal">
              {parsed.mainText}
            </p>
          )}

          {parsed.footerNote && (
            <div className="pt-2 border-t border-neutral-800/60 mt-2.5 flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
              <span className="text-sky-400 text-sm shrink-0">❄️</span>
              <span className="italic">{parsed.footerNote}</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`mt-2.5 space-y-1.5 ${className}`}>
        <div className="space-y-1">
          {parsed.items.map((item, idx) => {
            const match = item.match(/^(\d+)\s+(.+)$/);
            const qty = match ? match[1] : null;
            const name = match ? match[2] : item;

            return (
              <div key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-neutral-200">
                {qty ? (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-5.5 px-1.5 rounded bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0 mt-0.5">
                    {qty}
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                )}
                <span className="leading-snug">{name}</span>
              </div>
            );
          })}
        </div>

        {parsed.footerNote && (
          <div className="pt-2 border-t border-neutral-800/60 mt-2 flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
            <span className="text-sky-400 text-sm shrink-0">❄️</span>
            <span className="italic">{parsed.footerNote}</span>
          </div>
        )}
      </div>
    );
  }

  // --- 4. ADMIN DASHBOARD VIEW (Compact readable view) ---
  if (!parsed.isList) {
    return (
      <div className={`mt-1 ${className}`}>
        <p className="text-xs text-neutral-400 line-clamp-2">
          {parsed.mainText || parsed.raw}
        </p>
        {parsed.footerNote && (
          <div className="text-[10px] text-neutral-500 italic mt-1 flex items-center gap-1">
            <span className="text-sky-400 text-[10px]">❄️</span>
            <span className="truncate">{parsed.footerNote}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`mt-1.5 space-y-0.5 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block">
        {parsed.items.length} viandas:
      </span>
      <div className="space-y-0.5 max-h-20 overflow-y-auto pr-1">
        {parsed.items.map((item, idx) => (
          <div key={idx} className="text-[11px] text-neutral-300 truncate flex items-center gap-1">
            <span className="text-amber-500 text-[10px]">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      {parsed.footerNote && (
        <div className="text-[10px] text-neutral-500 italic pt-1 border-t border-neutral-800/50 mt-1 flex items-center gap-1">
          <span className="text-sky-400 text-[10px]">❄️</span>
          <span className="truncate">{parsed.footerNote}</span>
        </div>
      )}
    </div>
  );
};
