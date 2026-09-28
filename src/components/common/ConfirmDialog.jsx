import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // danger, warning, info
  loading = false,
}) => {
  const iconConfig = {
    danger: { icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100', btnVariant: 'danger' },
    warning: { icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-100', btnVariant: 'primary' },
    info: { icon: HelpCircle, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', btnVariant: 'primary' },
  }[type] || { icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100', btnVariant: 'danger' };

  const Icon = iconConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full border ${iconConfig.color} flex-shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <p className="mt-1.5 text-sm text-slate-600">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={iconConfig.btnVariant}
          loading={loading}
          onClick={() => {
            onConfirm();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
