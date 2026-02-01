import React from 'react';
import { AlertCircle, Trash2, CheckCircle2, X } from 'lucide-react';

export type ConfirmationType = 'danger' | 'warning' | 'success';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: ConfirmationType;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  type = 'warning',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  icon,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const colorSchemes = {
    danger: { bg: 'bg-red-50', border: 'border-red-200', button: 'bg-red-600 hover:bg-red-700', icon: 'text-red-600' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', button: 'bg-amber-600 hover:bg-amber-700', icon: 'text-amber-600' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', button: 'bg-emerald-600 hover:bg-emerald-700', icon: 'text-emerald-600' },
  };

  const colors = colorSchemes[type];

  const defaultIcons = {
    danger: <Trash2 size={24} className={colors.icon} />,
    warning: <AlertCircle size={24} className={colors.icon} />,
    success: <CheckCircle2 size={24} className={colors.icon} />,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-3xl shadow-2xl border ${colors.border} max-w-md w-full p-8 animate-in zoom-in duration-300`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`${colors.bg} p-4 rounded-2xl`}>
            {icon || defaultIcons[type]}
          </div>
        </div>

        {/* Title & Message */}
        <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">{title}</h3>
        <p className="text-sm text-slate-600 text-center mb-8">{message}</p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 ${colors.button} text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
