import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { BusinessInfo } from '../../types';
import {
  Share2,
  Copy,
  Check,
  Download,
  Printer,
  ExternalLink,
  QrCode,
  Smartphone,
  MessageCircle,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ShareAndQRTabProps {
  business: BusinessInfo;
}

export const ShareAndQRTab: React.FC<ShareAndQRTabProps> = ({ business }) => {
  const OFFICIAL_PUBLIC_URL = 'https://guateque-manduca-app.vercel.app';

  // Determine public customer URL
  const getInitialUrl = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('guateque_share_url');
      // If user saved a custom domain or custom URL (and it's not the old preview link), use it
      if (saved && saved.trim() && !saved.includes('ai.studio/apps/')) {
        return saved;
      }
      // If currently running in production on Vercel or a custom domain, use current origin
      if (
        window.location.origin &&
        !window.location.hostname.includes('run.app') &&
        !window.location.hostname.includes('google.com') &&
        !window.location.hostname.includes('localhost')
      ) {
        return window.location.origin;
      }
    }
    return OFFICIAL_PUBLIC_URL;
  };

  const [shareUrl, setShareUrl] = useState<string>(getInitialUrl());

  const handleUrlChange = (newUrl: string) => {
    setShareUrl(newUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('guateque_share_url', newUrl);
    }
  };

  // Helper to format WhatsApp phone in clear international standard (+54 9 11 3450-1611)
  const formattedPhone = (() => {
    const raw = business.whatsappPhone || '';
    const clean = raw.replace(/\D/g, '');
    if (clean.startsWith('54911') && clean.length === 13) {
      return `+54 9 11 ${clean.slice(5, 9)}-${clean.slice(9)}`;
    }
    if (clean.startsWith('549') && clean.length >= 12) {
      return `+54 9 ${clean.slice(3, 5)} ${clean.slice(5, 9)}-${clean.slice(9)}`;
    }
    if (clean.length > 8) {
      return `+${clean}`;
    }
    return clean ? `+${clean}` : '+54 9 11 3450-1611';
  })();

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDownloadingPoster, setIsDownloadingPoster] = useState<boolean>(false);
  const [posterDownloadSuccess, setPosterDownloadSuccess] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Generate high-resolution QR code whenever shareUrl changes
  useEffect(() => {
    let isCancelled = false;
    async function generateQR() {
      if (!shareUrl.trim()) return;
      setIsGenerating(true);
      try {
        const dataUrl = await QRCode.toDataURL(shareUrl.trim(), {
          width: 1024,
          margin: 2,
          color: {
            dark: '#171717',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        });
        if (!isCancelled) {
          setQrCodeDataUrl(dataUrl);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
      } finally {
        if (!isCancelled) setIsGenerating(false);
      }
    }

    generateQR();
    return () => {
      isCancelled = true;
    };
  }, [shareUrl]);

  // Copy URL to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download Full Poster as PNG (Includes Logo, QR with decorative frame, instructions and business data)
  const handleDownloadPoster = async () => {
    if (!qrCodeDataUrl) return;
    setIsDownloadingPoster(true);
    setDownloadError(null);
    setPosterDownloadSuccess(false);

    try {
      const canvas = document.createElement('canvas');
      const width = 960;
      const height = 1260;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No se pudo inicializar el contexto de renderizado');

      const drawRoundedRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) => {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, w, h, r);
        } else {
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
        }
      };

      const loadImageSafe = (src: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
          if (!src) {
            resolve(null);
            return;
          }
          const img = new Image();
          img.crossOrigin = 'anonymous';

          // Set timeout to avoid hanging indefinitely on slow external assets
          const timer = setTimeout(() => {
            console.warn('Timeout loading image:', src);
            resolve(null);
          }, 3500);

          img.onload = () => {
            clearTimeout(timer);
            resolve(img);
          };

          img.onerror = () => {
            clearTimeout(timer);
            // If it failed and is an external URL, try via proxy endpoint
            if (src.startsWith('http://') || src.startsWith('https://')) {
              const proxySrc = `/api/proxy-image?url=${encodeURIComponent(src)}`;
              const proxyImg = new Image();
              proxyImg.crossOrigin = 'anonymous';
              const proxyTimer = setTimeout(() => resolve(null), 3500);
              proxyImg.onload = () => {
                clearTimeout(proxyTimer);
                resolve(proxyImg);
              };
              proxyImg.onerror = () => {
                clearTimeout(proxyTimer);
                resolve(null);
              };
              proxyImg.src = proxySrc;
            } else {
              resolve(null);
            }
          };

          img.src = src;
        });
      };

      // 1. Background (Pure White card)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Outer subtle card border
      const pad = 24;
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 3;
      drawRoundedRect(pad, pad, width - pad * 2, height - pad * 2, 36);
      ctx.stroke();

      // 2. Business Logo (Bigger & Prominent)
      const logoSize = 160;
      const logoX = (width - logoSize) / 2;
      const logoY = 55;
      let logoDrawn = false;

      // Try primary logo URL, fallback to local /logo.jpg if fails
      const candidateLogoUrls = [
        business.logoUrl,
        '/logo.jpg',
      ].filter(Boolean);

      for (const url of candidateLogoUrls) {
        if (!url) continue;
        try {
          const logoImg = await loadImageSafe(url);
          if (logoImg && logoImg.width > 0 && logoImg.height > 0) {
            ctx.save();
            drawRoundedRect(logoX, logoY, logoSize, logoSize, 28);
            ctx.clip();
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            ctx.restore();

            // Stroke logo border
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 3;
            drawRoundedRect(logoX, logoY, logoSize, logoSize, 28);
            ctx.stroke();
            logoDrawn = true;
            break;
          }
        } catch (err) {
          console.warn('Error rendering logo:', err);
        }
      }

      if (!logoDrawn) {
        // Fallback logo badge
        ctx.fillStyle = '#171717';
        drawRoundedRect(logoX, logoY, logoSize, logoSize, 28);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 52px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initials = (business.name || 'GM').slice(0, 2).toUpperCase();
        ctx.fillText(initials, width / 2, logoY + logoSize / 2);
      }

      // 3. Business Name (Bigger and bold)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0a0a0a';
      ctx.font = '900 46px system-ui, -apple-system, sans-serif';
      ctx.fillText(business.name.toUpperCase(), width / 2, 260);

      // 4. Subtitle (Bigger and prominent)
      ctx.fillStyle = '#b45309';
      ctx.font = '800 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('MENÚ DIGITAL & PEDIDOS ONLINE', width / 2, 302);

      // 5. QR Code Container Box
      const qrBoxSize = 540;
      const qrBoxX = (width - qrBoxSize) / 2;
      const qrBoxY = 345;

      // Fill QR Box background
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28);
      ctx.fill();

      // Clean border for QR Box
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28);
      ctx.stroke();

      // Draw QR Code Image inside Box (dataUrl doesn't trigger CORS taint)
      const qrImg = await loadImageSafe(qrCodeDataUrl);
      if (qrImg) {
        const qrImgSize = 500;
        const qrImgX = (width - qrImgSize) / 2;
        const qrImgY = qrBoxY + (qrBoxSize - qrImgSize) / 2;
        ctx.drawImage(qrImg, qrImgX, qrImgY, qrImgSize, qrImgSize);
      }

      // 6. Scan Instructions Banner (Bigger & Clearer)
      const bannerW = 680;
      const bannerH = 110;
      const bannerX = (width - bannerW) / 2;
      const bannerY = 915;

      ctx.fillStyle = '#fffbeb'; // amber-50
      drawRoundedRect(bannerX, bannerY, bannerW, bannerH, 20);
      ctx.fill();

      ctx.strokeStyle = '#fcd34d'; // amber-300
      ctx.lineWidth = 2.5;
      drawRoundedRect(bannerX, bannerY, bannerW, bannerH, 20);
      ctx.stroke();

      ctx.fillStyle = '#78350f'; // amber-900
      ctx.font = '900 26px system-ui, -apple-system, sans-serif';
      ctx.fillText('¡ESCANEÁ CON LA CÁMARA DE TU CELULAR!', width / 2, bannerY + 44);

      ctx.fillStyle = '#374151'; // neutral-700
      ctx.font = '600 19px system-ui, -apple-system, sans-serif';
      ctx.fillText('Accedé a toda la carta y hacé tu pedido', width / 2, bannerY + 80);

      // 7. Footer Details (Bigger & Clearer)
      ctx.fillStyle = '#111827';
      ctx.font = '900 28px system-ui, -apple-system, sans-serif';
      ctx.fillText(`WhatsApp: ${formattedPhone}`, width / 2, 1070);

      ctx.fillStyle = '#1f2937';
      ctx.font = '800 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('📍 Villa Madero · Buenos Aires', width / 2, 1114);

      if (business.address) {
        ctx.fillStyle = '#4b5563';
        ctx.font = '600 17px system-ui, -apple-system, sans-serif';
        ctx.fillText(business.address, width / 2, 1152);
      }

      // 8. Trigger Download safely via Blob
      const fileName = `Cartel-QR-${business.name.replace(/\s+/g, '_')}.png`;

      canvas.toBlob((blob) => {
        if (!blob) {
          // Fallback to dataURL if toBlob fails
          const posterDataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = posterDataUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => document.body.removeChild(link), 200);
          setPosterDownloadSuccess(true);
          setTimeout(() => setPosterDownloadSuccess(false), 4000);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1000);

        setPosterDownloadSuccess(true);
        setTimeout(() => setPosterDownloadSuccess(false), 4000);
      }, 'image/png');
    } catch (err: any) {
      console.error('Error generating poster image:', err);
      setDownloadError(err?.message || 'Error al generar la imagen del cartel');
    } finally {
      setIsDownloadingPoster(false);
    }
  };

  // Trigger print of the QR card
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp share link
  const whatsappShareText = encodeURIComponent(
    `¡Hola! Te comparto nuestra carta digital de ${business.name} para que veas el menú y hagas tu pedido directamente por acá:\n👉 ${shareUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappShareText}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <span>Compartir Menú y Código QR</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Comparte el enlace directo con tus clientes o imprime el código QR para tus mesas, mostrador y empaques.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPoster}
            disabled={!qrCodeDataUrl || isDownloadingPoster}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingPoster ? 'Generando Cartel...' : 'Descargar Cartel Completo (PNG)'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Cartel</span>
          </button>
        </div>
      </div>

      {/* Download Status Notification */}
      {posterDownloadSuccess && (
        <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-200 text-xs shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-emerald-100 block text-sm">¡Cartel descargado con éxito!</strong>
              <span className="text-emerald-300">La imagen PNG en alta definición ya se encuentra guardada en tu carpeta de descargas.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPosterDownloadSuccess(false)}
            className="text-emerald-400 hover:text-emerald-200 text-xs px-2.5 py-1 rounded-lg bg-emerald-900/50 hover:bg-emerald-900/80 transition-colors"
          >
            Cerrar
          </button>
        </div>
      )}

      {downloadError && (
        <div className="bg-red-950/70 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 text-red-200 text-xs shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <strong className="text-red-100 block text-sm">No se pudo completar la descarga</strong>
              <span className="text-red-300">{downloadError}. Puedes usar la opción de "Imprimir Cartel" para guardarlo en PDF.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDownloadError(null)}
            className="text-red-400 hover:text-red-200 text-xs px-2.5 py-1 rounded-lg bg-red-900/50 hover:bg-red-900/80 transition-colors"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Share Links & Integrations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Public Link Box */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Enlace Público de tu Menú</h3>
            </div>
            
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Este es el enlace que tus clientes abrirán en sus celulares para ver los platos, armar su carrito y enviarte el pedido por WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={shareUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-mono focus:outline-hidden"
                  placeholder="https://tudominio.com"
                />
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick URL preset selectors */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {typeof window !== 'undefined' && window.location.origin && (
                <button
                  type="button"
                  onClick={() => handleUrlChange(window.location.origin)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                    shareUrl === window.location.origin
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                  }`}
                >
                  🔗 Usar enlace de esta app (en vivo)
                </button>
              )}
              <button
                type="button"
                onClick={() => handleUrlChange(OFFICIAL_PUBLIC_URL)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                  shareUrl === OFFICIAL_PUBLIC_URL
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                🌐 Usar enlace Vercel ({OFFICIAL_PUBLIC_URL.replace('https://', '')})
              </button>
            </div>

            {/* Explanatory note */}
            <div className="mt-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3 text-[11px] text-neutral-400 space-y-1">
              <p>
                <strong className="text-neutral-300">💡 ¿Dónde ven los cambios tus clientes?</strong>
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-neutral-400">
                <li>
                  <strong>En esta app:</strong> Cualquier plato, precio o foto que cambies se refleja de inmediato para todos los que abran el enlace en vivo de la app.
                </li>
                <li>
                  <strong>En tu enlace de Vercel:</strong> Vercel está conectado a GitHub, por lo que requiere exportar o sincronizar los cambios de código para actualizarse allí.
                </li>
              </ul>
            </div>

            {/* Link Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-neutral-800/80">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-amber-400 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir como cliente</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-950/70 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enviar por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Social / WhatsApp Link Preview Box */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Vista Previa en WhatsApp y Redes
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full font-semibold">
                Open Graph Activo
              </span>
            </div>

            {/* Simulated WhatsApp card */}
            <div className="bg-neutral-950/90 border border-neutral-800 rounded-2xl overflow-hidden max-w-md shadow-md">
              <div className="relative h-36 bg-neutral-900 flex items-center justify-center overflow-hidden">
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-[10px] font-mono text-neutral-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {shareUrl.replace('https://', '').split('/')[0]}
                </span>
              </div>
              <div className="p-3.5">
                <h5 className="text-sm font-bold text-neutral-100 mb-1">
                  Menú Digital · {business.name}
                </h5>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  Carta digital interactiva con viandas artesanales, empanadas, postres y pedidos directos por WhatsApp.
                </p>
              </div>
            </div>

            {/* Helpful Note about Official Link */}
            <div className="mt-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 leading-relaxed space-y-2">
              <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Enlace oficial público configurado</span>
              </p>
              <p className="text-[11px] text-neutral-400">
                Tu enlace oficial público de Google AI Studio con pantalla completa ya está configurado por defecto tanto en el botón de compartir como en el <strong>código QR</strong>.
              </p>
              <p className="text-[11px] text-neutral-400">
                Cualquier cliente que escanee el QR o haga clic en el enlace accederá a la carta interactiva a pantalla completa y sin interrupciones.
              </p>
            </div>
          </div>

          {/* Practical Tips */}
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>¿Dónde colocar tu código QR y enlace?</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Instagram y Redes Sociales:</strong> Agrega el enlace en tu biografía de Instagram o historias destacadas con el botón de enlace directo.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <QrCode className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Mesas y Mostrador:</strong> Imprime el cartel QR y colócalo en un portarretrato o cartelito acrílico en el mostrador para que los clientes escaneen al llegar.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Download className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Descarga del Cartel Completo:</strong> Guarda el cartel listo con tu logo, recuadro de QR e instrucciones en formato imagen PNG para imprimirlo, enmarcarlo o compartirlo en tus estados.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  <strong>WhatsApp Business:</strong> Añade el enlace en la sección "Catálogo" o "Sitio web" del perfil de WhatsApp de la empresa.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Printable Poster Mockup & Live QR (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Printable Poster Card (Screen Preview) */}
          <div
            ref={printRef}
            id="printable-qr-card"
            className="w-full max-w-md bg-white text-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 flex flex-col items-center text-center transition-all"
          >
            {/* Business Logo */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-neutral-200 shadow-md mb-3 bg-neutral-950">
              <img
                src={business.logoUrl || '/logo.jpg'}
                alt={business.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Business Name */}
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
              {business.name}
            </h3>
            <p className="text-xs sm:text-sm text-amber-700 font-bold uppercase tracking-wider mt-1 mb-4">
              Menú Digital & Pedidos Online
            </p>

            {/* QR Code Container */}
            <div className="relative p-3.5 bg-neutral-50 rounded-2xl border-2 border-neutral-200 mb-4 shadow-sm">
              {isGenerating ? (
                <div className="w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-neutral-500">Generando QR...</span>
                </div>
              ) : qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Código QR del Menú"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                />
              ) : null}
            </div>

            {/* Scan instructions */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl px-5 py-3 mb-4 w-full">
              <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider block">
                ¡Escaneá con la cámara de tu celular!
              </span>
              <span className="text-xs font-semibold text-neutral-700 block mt-0.5">
                Accedé a toda la carta y hacé tu pedido
              </span>
            </div>

            {/* Footer details */}
            <div className="w-full space-y-1 pt-1 text-center">
              <span className="text-sm sm:text-base font-black text-neutral-950 block">
                WhatsApp: {formattedPhone}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-neutral-800 block">
                📍 Villa Madero · Buenos Aires
              </span>
              {business.address && (
                <span className="text-[11px] sm:text-xs font-medium text-neutral-600 block max-w-xs mx-auto leading-relaxed">
                  {business.address}
                </span>
              )}
            </div>
          </div>

          {/* Quick Buttons below poster */}
          <div className="w-full max-w-md flex items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={handleDownloadPoster}
              disabled={!qrCodeDataUrl || isDownloadingPoster}
              className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{isDownloadingPoster ? 'Generando Cartel...' : 'Descargar Cartel Completo'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Imprimir Cartel</span>
            </button>
          </div>
        </div>
      </div>

      {/* PORTAL FOR PRINTING (renders directly to body so no other UI interferes or creates 2nd pages) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="print-poster-portal">
            {/* TOP: Brand Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Business Logo */}
              <div
                style={{
                  width: '125px',
                  height: '125px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '3px solid #f0f0f0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  backgroundColor: '#0a0a0a',
                  marginBottom: '14px',
                }}
              >
                <img
                  src={business.logoUrl || '/logo.jpg'}
                  alt={business.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Business Name */}
              <h1
                style={{
                  fontSize: '40px',
                  fontWeight: '900',
                  letterSpacing: '-0.03em',
                  color: '#0a0a0a',
                  textTransform: 'uppercase',
                  margin: '0 0 6px 0',
                  lineHeight: '1.1',
                }}
              >
                {business.name}
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '19px',
                  fontWeight: '800',
                  letterSpacing: '0.06em',
                  color: '#b45309',
                  textTransform: 'uppercase',
                  margin: '0',
                }}
              >
                Menú Digital & Pedidos Online
              </p>
            </div>

            {/* CENTER: QR Code (large and clean) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto 0' }}>
              <div
                style={{
                  padding: '14px',
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '3px solid #e5e5e5',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                }}
              >
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Código QR del Menú"
                    style={{
                      width: '290px',
                      height: '290px',
                      display: 'block',
                    }}
                  />
                ) : null}
              </div>
            </div>

            {/* BOTTOM: Instructions Banner, WhatsApp, and Address */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: '12px',
              }}
            >
              {/* Scan instructions banner */}
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '2px solid #fcd34d',
                  borderRadius: '18px',
                  padding: '12px 28px',
                  width: '100%',
                  maxWidth: '520px',
                  boxSizing: 'border-box',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '18px',
                    fontWeight: '900',
                    color: '#78350f',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  ¡Escaneá con la cámara de tu celular!
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#404040',
                    marginTop: '3px',
                  }}
                >
                  Accedé a toda la carta y hacé tu pedido
                </span>
              </div>

              {/* Contact & Location Info */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: '900',
                    color: '#111827',
                    letterSpacing: '-0.01em',
                  }}
                >
                  WhatsApp: {formattedPhone}
                </div>

                <div
                  style={{
                    fontSize: '17px',
                    fontWeight: '800',
                    color: '#1f2937',
                  }}
                >
                  📍 Villa Madero · Buenos Aires
                </div>

                {business.address && (
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#4b5563',
                      maxWidth: '500px',
                    }}
                  >
                    {business.address}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Embedded print styles: ensures exactly ONE page, removes browser URL codes, and fits page vertically */}
      <style>{`
        @page {
          size: portrait;
          margin: 0 !important;
        }

        @media screen {
          #print-poster-portal {
            display: none !important;
          }
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Completely remove the app UI from print layout */
          #root,
          body > *:not(#print-poster-portal) {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
          }

          #print-poster-portal {
            display: flex !important;
            visibility: visible !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            padding: 2.2cm 2cm 2cm 2cm !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: space-between !important;
            text-align: center !important;
            background: #ffffff !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-before: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
          }

          #print-poster-portal * {
            visibility: visible !important;
          }
        }
      `}</style>
    </div>
  );
};
