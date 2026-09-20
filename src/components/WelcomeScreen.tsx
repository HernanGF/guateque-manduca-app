import React from 'react';
import { BusinessInfo } from '../types';
import {
  Utensils,
  Clock,
  MapPin,
  ArrowRight,
  Lock,
  ShoppingBag,
  Bike,
  MessageCircle,
} from 'lucide-react';

interface WelcomeScreenProps {
  business: BusinessInfo;
  onEnterMenu: () => void;
  onOpenAdmin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  business,
  onEnterMenu,
  onOpenAdmin,
}) => {
  const cleanPhone = (business.whatsappPhone || '5491134501611').replace(/[^0-9]/g, '');
  const whatsappChatUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `¡Hola ${business.name}! Tengo una consulta.`
  )}`;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-amber-500 selection:text-black relative">
      {/* 1. Full-Width Panoramic Hero Banner (Occupy entire width of screen) */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden bg-neutral-100 select-none">
        <img
          src={business.bannerUrl}
          alt={business.name}
          className="w-full h-full object-cover brightness-95"
          referrerPolicy="no-referrer"
        />
        {/* Soft gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/40 to-transparent" />

        {/* Top Floating Bar directly over the Banner */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4 flex items-center justify-between w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-lg">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-neutral-950 font-bold">
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium tracking-wide text-xs sm:text-sm text-white">
              Menú Digital Online
            </span>
          </div>

          {/* Discreet padlock button */}
          <button
            id="btn-admin-access-welcome"
            onClick={onOpenAdmin}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-white/80 hover:text-amber-400 border border-white/20 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg"
            title="Acceso seguro"
            aria-label="Acceso seguro"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Centered Business Logo (100% visible, completely unclipped, outside overflow-hidden) */}
      <div className="relative z-10 -mt-16 sm:-mt-20 md:-mt-22 flex justify-center px-4">
        <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-3xl p-1.5 bg-white border-4 border-neutral-100 shadow-2xl flex items-center justify-center">
          <img
            src={business.logoUrl}
            alt={business.name}
            className="w-full h-full object-contain rounded-2xl bg-white"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 3. Main Presentation Content */}
      <main className="w-full max-w-4xl mx-auto px-4 pt-4 pb-12 flex flex-col items-center text-center flex-1">
        {/* Business Title & Description */}
        <div className="max-w-xl mt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-3">
            {business.name}
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal mb-6">
            {business.description}
          </p>

          {/* Badges / Highlights */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {business.deliveryAvailable && (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700">
                <Bike className="w-4 h-4 text-amber-600" />
                Envío a Domicilio
              </span>
            )}
            {business.takeawayAvailable && (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Retiro en Local
              </span>
            )}
            <a
              id="btn-whatsapp-badge"
              href={whatsappChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 hover:border-green-500/50 text-neutral-700 hover:text-neutral-900 transition-all cursor-pointer"
              title="Abrir chat de WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Consultas por WhatsApp</span>
            </a>
          </div>

          {/* Prominent CTA Button */}
          <button
            id="btn-enter-menu"
            onClick={onEnterMenu}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 active:scale-98 text-neutral-950 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Ver Menú y Hacer Pedido</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Practical info footer */}
        <div className="mt-12 pt-8 border-t border-neutral-200 w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs sm:text-sm text-neutral-600">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="block font-bold text-neutral-900">Horarios</span>
              <span>{business.hours}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="block font-bold text-neutral-900">Ubicación</span>
              <span>{business.address}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Quick Chat Button (Always Accessible) */}
      <a
        id="btn-whatsapp-floating-welcome"
        href={whatsappChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
        title="Hacer una consulta por WhatsApp"
        aria-label="Hacer una consulta por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white/20 transition-transform group-hover:scale-110" />
      </a>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-neutral-500 border-t border-neutral-200">
        Menú digital en la nube • Pedidos directos sin comisiones
      </footer>
    </div>
  );
};
