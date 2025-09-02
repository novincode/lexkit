import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export const componentRegistry: Record<string, (props: any) => ReactNode> = {
  Button: ({ selected, className, children, ...props }: { selected?: boolean; className?: string; children: ReactNode; [key: string]: any }) => (
    <button
      className={cn(
        'px-2 py-1 border rounded',
        selected && 'bg-blue-500 text-white',
        className
      )}
      {...props}
    >
      {children}
    </button>
  ),
  Toolbar: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('flex gap-1 mb-2', className)}>
      {children}
    </div>
  ),
};

export function registerComponents(overrides: Partial<typeof componentRegistry>) {
  Object.assign(componentRegistry, overrides);
}
