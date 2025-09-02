import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ComponentType, CSSProperties } from 'react';
import { useEditor } from '../../../core/useEditor';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '@repo/editor/extensions';

const ItalicUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> = () => {
  const { t, components, commands } = useEditor();

  const toggleItalic = () => {
    commands.formatText('italic');
  };

  const isItalicActive = commands.isActive('italic');

  const Button = components.Button;

  return (
    <Button onClick={toggleItalic} selected={isItalicActive}>
      {t('italic.label')}
    </Button>
  );
};

export class ItalicExtension extends BaseExtension {
  constructor() {
    super('italic', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Lexical handles FORMAT_TEXT_COMMAND internally
    return () => {};
  }

  getUI(): ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> | null {
    return ItalicUI;
  }
}

export const italicExtension = new ItalicExtension();
