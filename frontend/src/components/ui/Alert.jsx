import { cn } from '../../utils/helpers';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Alert = ({ variant = 'info', title, children, className, onClose }) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-600" />,
      title: 'text-blue-800',
      content: 'text-blue-700',
    },
    success: {
      container: 'bg-green-50 border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'text-green-800',
      content: 'text-green-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      title: 'text-yellow-800',
      content: 'text-yellow-700',
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      title: 'text-red-800',
      content: 'text-red-700',
    },
  };

  const style = variants[variant];

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        style.container,
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', style.title)}>{title}</h3>
          )}
          {children && (
            <div className={cn('text-sm', title && 'mt-1', style.content)}>
              {children}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
