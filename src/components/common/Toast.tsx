import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast, clearToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgColors[toast.type]} backdrop-blur-sm`}>
        {icons[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
