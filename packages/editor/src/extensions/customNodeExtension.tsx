import {
  DecoratorNode,
  TextNode,
  NodeKey,
  EditorConfig,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $createNodeSelection,
  $setSelection,
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
  $insertNodes,
  $getRoot,
  $createParagraphNode,
  LexicalEditor,
} from 'lexical';
import { ReactNode, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BaseExtension } from './BaseExtension';
import { BaseExtensionConfig, ExtensionCategory } from './types';

// Generic payload for custom node (users can extend via config)
type CustomPayload = Record<string, any>;

// Serialized form (spread for flexibility)
type SerializedCustomNode = Spread<{
  type: string;
  payload: CustomPayload;
}, SerializedLexicalNode>;

// Config interface for the factory
interface CustomNodeConfig<CustomCommands, CustomStateQueries> {
  nodeType: string; // e.g., 'myCustomBlock'
  defaultPayload?: CustomPayload; // Initial data
  render: (props: {
    node: any;
    payload: CustomPayload;
    children?: ReactNode;
    nodeKey: string;
    isSelected: boolean;
    updatePayload: (newPayload: CustomPayload) => void;
  }) => ReactNode; // React render with children callback
  importJSON?: (serialized: SerializedCustomNode) => CustomPayload;
  exportJSON?: (payload: CustomPayload) => SerializedCustomNode;
  importDOM?: () => DOMConversionMap | null;
  exportDOM?: (editor: LexicalEditor, node: LexicalNode) => DOMExportOutput;
  commands?: (editor: LexicalEditor) => CustomCommands; // Custom commands
  stateQueries?: (editor: LexicalEditor) => CustomStateQueries; // Custom queries
}

// Factory function (generic for type safety)
export function createCustomNodeExtension<
  Name extends string,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {}
>(config: CustomNodeConfig<Commands, StateQueries>) {
  const INSERT_CUSTOM_NODE = createCommand<CustomPayload>('insert-custom-node');

  // Dynamic node class based on config
  class CustomNode extends DecoratorNode<ReactNode> {
    __payload: CustomPayload;

    static getType(): string {
      return config.nodeType;
    }

    static clone(node: CustomNode): CustomNode {
      return new CustomNode(node.__payload, node.getKey());
    }

    constructor(payload: CustomPayload = config.defaultPayload || {}, key?: NodeKey) {
      super(key);
      this.__payload = payload;
    }

    static importJSON(serialized: SerializedCustomNode): CustomNode {
      const payload = config.importJSON ? config.importJSON(serialized) : serialized.payload;
      return new CustomNode(payload);
    }

    exportJSON(): SerializedCustomNode {
      const serialized = config.exportJSON ? config.exportJSON(this.__payload) : { payload: this.__payload };
      return {
        type: config.nodeType,
        version: 1,
        ...serialized,
      };
    }

    static importDOM(): DOMConversionMap | null {
      return config.importDOM ? config.importDOM() : null;
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
      return config.exportDOM ? config.exportDOM(editor, this as LexicalNode) : { element: document.createElement('div') };
    }

    createDOM(config: EditorConfig): HTMLElement {
      return document.createElement('div');
    }

    updateDOM(prevNode: CustomNode, dom: HTMLElement): boolean {
      return false;
    }

    getPayload(): CustomPayload {
      return (this.getLatest() as CustomNode).__payload;
    }

    setPayload(payload: CustomPayload): void {
      const writable = this.getWritable() as CustomNode;
      writable.__payload = { ...writable.__payload, ...payload };
    }

    decorate(): ReactNode {
      return <CustomDecorator node={this} />;
    }
  }

  // Helper to create node
  function $createCustomNode(payload: CustomPayload): CustomNode {
    return new CustomNode(payload);
  }

  // Decorator component for handling selection
  function CustomDecorator({ node }: { node: CustomNode }) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          setIsSelected(
            !!(selection && $isNodeSelection(selection) && selection.getNodes().some((n) => n.getKey() === node.getKey()))
          );
        });
      });
    }, [editor, node]);

    const updatePayload = (newPayload: CustomPayload) => {
      editor.update(() => {
        node.setPayload(newPayload);
      });
    };

    return config.render({
      node,
      payload: node.__payload,
      children: undefined,
      nodeKey: node.getKey(),
      isSelected,
      updatePayload,
    });
  }

  // The extension class
  class CustomNodeExtension extends BaseExtension<Name, BaseExtensionConfig, Commands, StateQueries> {
    constructor() {
      super(config.nodeType as Name, [ExtensionCategory.Toolbar]); // Assuming toolbar for now
    }

    register(editor: LexicalEditor): () => void {
      // Register insert command (default; users can override in config.commands)
      const unregisterInsert = editor.registerCommand(
        INSERT_CUSTOM_NODE,
        (payload: CustomPayload) => {
          editor.update(() => {
            const node = $createCustomNode(payload);
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertNodes([node as LexicalNode]);
            } else {
              $getRoot().append($createParagraphNode().append(node as LexicalNode));
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      return unregisterInsert;
    }

    getNodes(): any[] {
      return [CustomNode];
    }

    getCommands(editor: LexicalEditor): Commands {
      const commandName = `insert${config.nodeType.charAt(0).toUpperCase() + config.nodeType.slice(1)}`;
      const defaultCommands = {
        [commandName]: (payload: CustomPayload) => { editor.dispatchCommand(INSERT_CUSTOM_NODE, payload); },
      } as unknown as Partial<Commands>;

      return { ...defaultCommands, ...(config.commands ? config.commands(editor) : {}) } as Commands;
    }

    getStateQueries(editor: LexicalEditor): StateQueries {
      const defaultQueries = {
        isCustomNodeActive: () => Promise.resolve(false), // Placeholder; implement based on need
      } as unknown as Partial<StateQueries>;

      return { ...defaultQueries, ...(config.stateQueries ? config.stateQueries(editor) : {}) } as StateQueries;
    }
  }

  return { extension: new CustomNodeExtension(), $createCustomNode };
}
