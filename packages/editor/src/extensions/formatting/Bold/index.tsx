import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ComponentType, CSSProperties } from 'react';
import { useEditor } from '../../../core/useEditor';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '@repo/editor/extensions';

const BoldUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> = () => {
  const { t, components, commands } = useEditor();

  const toggleBold = () => {
    commands.formatText('bold');
  };

  const Button = components.Button;

  return (
    <Button onClick={toggleBold} selected={false}>
      {t('bold.label')}
    </Button>
  );
};

export class BoldExtension extends BaseExtension {
  constructor() {
    super('bold', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    return editor.registerCommand(FORMAT_TEXT_COMMAND, (payload: any) => {
      if (payload === 'bold') {
        // Toggle bold logic - assuming Lexical handles it
        return true;
      }
      return false;
    }, 4);
  }

  getUI(): ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> | null {
    return BoldUI;
  }
}