import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  ChevronRight,
  Smartphone
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSuccess: (method: 'apple_pay' | 'visa' | 'google_pay') => void;
  totalFare: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirmSuccess,
  totalFare,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'apple_pay' | 'visa' | 'google_pay'>('apple_pay');
  const [processingState, setProcessingState] = useState<'idle' | 'authorizing' | 'success'>('idle');

  if (!isOpen) return null;

  const handlePay = () => {
    setProcessingState('authorizing');
    setTimeout(() => {
      setProcessingState('success');
      setTimeout(() => {
        onConfirmSuccess(selectedMethod);
        setProcessingState('idle');
      }, 1200);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6">
        
        {processingState === 'idle' && (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Select Payment Method</h3>
                  <p className="text-xs text-slate-500">Encrypted tokenization via Stripe</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Price Preview Card */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Trip Authorization Total</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                  Pre-Authorized
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold tracking-tight font-mono tabular-nums">
                  £{totalFare.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">VAT (20%) & Airport Surcharge included</span>
              </div>
            </div>

            {/* Payment Method Options */}
            <div className="space-y-2.5">
              {/* Apple Pay */}
              <button
                type="button"
                onClick={() => setSelectedMethod('apple_pay')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                  selectedMethod === 'apple_pay'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                    
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Apple Pay</span>
                    <span className="text-[11px] text-slate-500 block">Biometric 1-click FaceID</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'apple_pay' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'apple_pay' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>

              {/* Visa Credit Card */}
              <button
                type="button"
                onClick={() => setSelectedMethod('visa')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                  selectedMethod === 'visa'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
                    VISA
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Barclays Visa Debit · 4892</span>
                    <span className="text-[11px] text-slate-500 block">Expires 09/28 · Default Personal</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'visa' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'visa' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>

              {/* Google Pay */}
              <button
                type="button"
                onClick={() => setSelectedMethod('google_pay')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                  selectedMethod === 'google_pay'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs border border-slate-200">
                    GPay
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Google Pay</span>
                    <span className="text-[11px] text-slate-500 block">Direct wallet authorization</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'google_pay' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'google_pay' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            </div>

            {/* Pay Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm Payment of £{totalFare.toFixed(2)}</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2.5 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                3D-Secure 2.2 · Zero fraud liability guarantee
              </p>
            </div>
          </>
        )}

        {/* Processing State */}
        {processingState === 'authorizing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <Lock className="w-6 h-6 text-blue-600 absolute inset-0 m-auto" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Authorizing via Stripe Gateway</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Tokenizing cryptographic payload with card issuer for £{totalFare.toFixed(2)}...
            </p>
          </div>
        )}

        {/* Success State */}
        {processingState === 'success' && (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Payment Pre-Authorized!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Receipt token #TXN-9021-UK verified. Dispatching vehicle...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
