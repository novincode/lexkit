import { ReactNode, forwardRef } from 'react';
import { cn } from '../utils/cn';

type ButtonProps = {
  variant?: 'default' | 'outline' | 'ghost';
  selected?: boolean;
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const DefaultButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', selected, className, children, ...props }, ref) => {
    const baseClass = 'px-2 py-1 border rounded inline-flex items-center justify-center';
    const variantClasses = {
      default: 'bg-white',
      outline: 'border-blue-500',
      ghost: 'border-none',
    };
    const variantClass = variantClasses[variant];
    const selectedClass = selected ? 'bg-blue-500 text-white' : '';
    return (
      <button
        ref={ref}
        className={cn(baseClass, variantClass, selectedClass, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const componentRegistry = {
  Button: DefaultButton,
  Toolbar: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('flex gap-1 mb-2', className)}>{children}</div>
  ),
  // Add more components as needed
};

export function registerComponents(overrides: Partial<{ [K in keyof typeof componentRegistry]: typeof componentRegistry[K] }>) {
  Object.assign(componentRegistry, overrides);
}
