import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '../../types';

export class HistoryExtension extends BaseExtension<'history'> {
  constructor() {
    super('history', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // No registration needed for history
    return () => {};
  }

  getPlugins() {
    return [this.lazyLoadHistoryPlugin()];
  }

  private async lazyLoadHistoryPlugin() {
    const { HistoryPlugin } = await import('@lexical/react/LexicalHistoryPlugin');
    return <HistoryPlugin key="history-plugin" />;
  }
}

export const historyExtension = new HistoryExtension();
