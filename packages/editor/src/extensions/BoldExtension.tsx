import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { useEditor } from '../core/EditorProvider';
import { LexicalEditor } from 'lexical';

function BoldUI() {
  const { t, components } = useEditor();
  const [editor] = useLexicalComposerContext();

  const toggleBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const Button = components.Button as any;

  return (
    <Button onClick={toggleBold}>
      {t('bold.label')}
    </Button>
  );
}

const register = (editor: LexicalEditor) => {
  return editor.registerCommand(FORMAT_TEXT_COMMAND, (payload: any) => {
    if (payload === 'bold') {
      // Toggle bold logic
      return true;
    }
    return false;
  }, 4);
};

export const BoldExtension = {
  register,
  UI: BoldUI,
};
