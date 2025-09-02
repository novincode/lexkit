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

  const Button = components.Button;

  return (
    <Button onClick={toggleItalic} selected={false}>
      {t('italic.label')}
    </Button>
  );
};

export class ItalicExtension extends BaseExtension {
  constructor() {
    super('italic', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    return editor.registerCommand(FORMAT_TEXT_COMMAND, (payload: any) => {
      if (payload === 'italic') {
        return true;
      }
      return false;
    }, 4);
  }

  getUI(): ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> | null {
    return ItalicUI;
  }
}

export const italicExtension = new ItalicExtension();
