import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#a3e635] shrink-0" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
        };

        const borderColors = {
          success: 'border-[#a3e635]/40',
          info: 'border-cyan-500/40',
          warning: 'border-amber-500/40',
          error: 'border-rose-500/40',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#0e141d] border ${borderColors[toast.type]} shadow-2xl backdrop-blur-md text-white transition-all duration-300 animate-in slide-in-from-bottom-3`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium text-slate-200 flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
