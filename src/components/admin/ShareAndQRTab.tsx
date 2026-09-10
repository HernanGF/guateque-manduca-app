import React, { useState, useEffect, useRef } from 'react';
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

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
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

  // Download QR Code PNG
  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `QR-Menu-${business.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            onClick={handleDownloadQR}
            disabled={!qrCodeDataUrl}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar QR (PNG)</span>
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

            {shareUrl !== OFFICIAL_PUBLIC_URL && (
              <button
                type="button"
                onClick={() => handleUrlChange(OFFICIAL_PUBLIC_URL)}
                className="text-[11px] text-amber-400 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Restablecer al enlace oficial de la app</span>
              </button>
            )}

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
                  <strong>Stickers para Viandas y Catering:</strong> Descarga el archivo PNG en alta definición e imprímelo en stickers para pegarlo en las bolsas y cajas de entrega.
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
          
          {/* Printable Poster Card */}
          <div
            ref={printRef}
            id="printable-qr-card"
            className="w-full max-w-sm bg-white text-neutral-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-200 flex flex-col items-center text-center transition-all"
          >
            {/* Business Logo */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-md mb-3 bg-neutral-950">
              <img
                src={business.logoUrl}
                alt={business.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Business Name */}
            <h3 className="text-xl font-black tracking-tight text-neutral-950 uppercase">
              {business.name}
            </h3>
            <p className="text-xs text-neutral-600 font-medium mt-0.5 mb-4">
              Menú Digital & Pedidos Online
            </p>

            {/* QR Code Container */}
            <div className="relative p-3 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300 mb-4 shadow-inner">
              {isGenerating ? (
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] text-neutral-500">Generando QR...</span>
                </div>
              ) : qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Código QR del Menú"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                />
              ) : null}
            </div>

            {/* Scan instructions */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 mb-3">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">
                ¡Escaneá con la cámara de tu celular!
              </span>
              <span className="text-[11px] text-neutral-700 block mt-0.5">
                Accedé a toda la carta y hacé tu pedido
              </span>
            </div>

            {/* Footer details */}
            <div className="text-[11px] text-neutral-500 space-y-0.5">
              <span>WhatsApp: +{business.whatsappPhone}</span>
              {business.address && <span className="block truncate max-w-[260px]">{business.address}</span>}
            </div>
          </div>

          {/* Quick Buttons below poster */}
          <div className="w-full max-w-sm flex items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Guardar imagen</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded print styles for when user clicks print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-qr-card, #printable-qr-card * {
            visibility: visible !important;
          }
          #printable-qr-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(1.15) !important;
            box-shadow: none !important;
            border: 1px solid #e5e5e5 !important;
            margin: 0 !important;
            padding: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};
