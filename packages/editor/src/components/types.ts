import { ComponentType, ReactNode } from 'react';

export interface ComponentRegistry {
  Button: ComponentType<{ variant?: 'default' | 'outline' | 'ghost'; selected?: boolean; className?: string; children: ReactNode; [key: string]: any }>;
  Toolbar: ComponentType<{ children: ReactNode; className?: string }>;
  [key: string]: ComponentType<any>;
}
