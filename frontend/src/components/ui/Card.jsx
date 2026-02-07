import { cn } from '../../utils/helpers';

const Card = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-sm',
        hover && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => {
  return (
    <div className={cn('px-5 py-4 border-b border-gray-100', className)}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className }) => {
  return <div className={cn('p-5', className)}>{children}</div>;
};

const CardFooter = ({ children, className }) => {
  return (
    <div className={cn('px-5 py-4 border-t border-gray-100', className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
