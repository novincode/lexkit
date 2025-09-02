import { useContext } from 'react';
import { EditorContext } from './EditorProvider';

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
