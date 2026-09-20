import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Delete, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CORRECT_PIN = '1151';

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4 || isSuccess) return;
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 900);
        }
      }
    },
    [pin, isSuccess, onSuccess]
  );

  const handleDelete = useCallback(() => {
    if (pin.length > 0 && !isSuccess) {
      setPin(pin.slice(0, -1));
      setError(false);
    }
  }, [pin, isSuccess]);

  const handleClear = useCallback(() => {
    if (!isSuccess) {
      setPin('');
      setError(false);
    }
  }, [isSuccess]);

  // Handle keyboard inputs
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDigit, handleDelete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xs bg-white border border-neutral-200 rounded-2xl shadow-2xl p-6 text-center text-neutral-900 flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
            isSuccess
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : error
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-6 h-6 animate-bounce" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
        </div>

        <h3 className="text-base font-bold text-neutral-900 mb-1">
          {isSuccess ? 'Acceso Autorizado' : 'Código de Seguridad'}
        </h3>
        <p className="text-xs text-neutral-500 mb-5">
          {isSuccess
            ? 'Ingresando...'
            : error
            ? 'PIN incorrecto. Intenta de nuevo.'
            : 'Ingresa el PIN de 4 dígitos'}
        </p>

        {/* PIN Dots representation */}
        <div
          className={`flex items-center justify-center gap-3 mb-6 transition-transform ${
            error ? 'animate-shake' : ''
          }`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isSuccess
                    ? 'bg-emerald-500 scale-110 shadow-sm shadow-emerald-500/50'
                    : error
                    ? 'bg-red-500 scale-100'
                    : isFilled
                    ? 'bg-amber-500 scale-110 shadow-sm shadow-amber-500/50'
                    : 'bg-neutral-200 border border-neutral-300'
                }`}
              />
            );
          })}
        </div>

        {/* Error message indicator */}
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 mb-4 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>El PIN ingresado no es válido</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[240px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-amber-500 active:text-white text-neutral-900 font-bold text-lg transition-all flex items-center justify-center cursor-pointer shadow-xs border border-neutral-200"
            >
              {digit}
            </button>
          ))}

          {/* Clear button */}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-neutral-100/60 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 font-semibold text-xs transition-colors flex items-center justify-center cursor-pointer border border-neutral-200"
          >
            C
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-amber-500 active:text-white text-neutral-900 font-bold text-lg transition-all flex items-center justify-center cursor-pointer shadow-xs border border-neutral-200"
          >
            0
          </button>

          {/* Delete Backspace button */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-xl bg-neutral-100/60 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors flex items-center justify-center cursor-pointer border border-neutral-200"
            title="Borrar último dígito"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
