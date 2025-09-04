import {
  $createParagraphNode,
  $createTextNode,
  DecoratorNode,
  ElementNode,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  SerializedLexicalNode,
  EditorConfig,
  Spread,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
  $insertNodes,
  $getRoot,
  LexicalEditor,
  $getNodeByKey,
  COPY_COMMAND,
  CUT_COMMAND,
  PASTE_COMMAND,
} from 'lexical';
import { ReactNode, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BaseExtension } from './BaseExtension';
import { BaseExtensionConfig, ExtensionCategory } from './types';

// Generic payload
type CustomPayload = Record<string, any>;

// Serialized with children if container
type SerializedCustomNode = Spread<{
  type: string;
  payload: CustomPayload;
  children?: SerializedLexicalNode[];
}, SerializedLexicalNode>;

// Config interface
interface CustomNodeConfig<CustomCommands, CustomStateQueries> {
  nodeType: string;
  isContainer?: boolean;
  defaultPayload?: CustomPayload;
  initialChildren?: () => SerializedLexicalNode[];
  render?: (props: {
    node: LexicalNode;
    payload: CustomPayload;
    children?: ReactNode;
    nodeKey: string;
    isSelected: boolean;
    updatePayload: (newPayload: Partial<CustomPayload>) => void;
  }) => ReactNode;
  createDOM?: (config: EditorConfig, node: LexicalNode) => HTMLElement;
  updateDOM?: (prevNode: LexicalNode, dom: HTMLElement, config: EditorConfig) => boolean;
  commands?: (editor: LexicalEditor) => CustomCommands;
  stateQueries?: (editor: LexicalEditor) => CustomStateQueries;
}

// Factory function
export function createCustomNodeExtension<
  Name extends string,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {}
>(userConfig: CustomNodeConfig<Commands, StateQueries>) {
  const isContainer = userConfig.isContainer ?? false;
  const INSERT_CUSTOM_NODE = createCommand<CustomPayload>('insert-custom-node');

  // Element Node for containers
  class CustomElementNode extends ElementNode {
    __payload: CustomPayload;
    __nodeType: string;

    static getType(): string {
      return userConfig.nodeType;
    }

    static clone(node: CustomElementNode): CustomElementNode {
      return new CustomElementNode(node.__payload, node.__nodeType, node.__key);
    }

    constructor(
      payload: CustomPayload = {},
      nodeType: string,
      key?: NodeKey
    ) {
      super(key);
      this.__payload = payload;
      this.__nodeType = nodeType;
    }

    isSelectable(): boolean {
      return true;
    }

    canBeEmpty(): boolean {
      return false;
    }

    canInsertTextBefore(): boolean {
      return false;
    }

    canInsertTextAfter(): boolean {
      return false;
    }

    static importJSON(serialized: SerializedCustomNode): CustomElementNode {
      const { payload, children } = serialized;
      const node = new CustomElementNode(payload, serialized.type);
      return node;
    }

    exportJSON(): SerializedElementNode {
      return {
        type: this.__nodeType,
        version: 1,
        payload: this.__payload,
        children: this.getChildren().map(child => child.exportJSON()),
        direction: null,
        format: '',
        indent: 0,
      } as any;
    }

    createDOM(config: EditorConfig): HTMLElement {
      const element = document.createElement('div');
      element.setAttribute('data-custom-node-type', this.__nodeType);
      
      if (userConfig.createDOM) {
        return userConfig.createDOM(config, this);
      }
      
      return element;
    }

    updateDOM(prevNode: CustomElementNode, dom: HTMLElement, config: EditorConfig): boolean {
      if (userConfig.updateDOM) {
        return userConfig.updateDOM(prevNode, dom, config);
      }
      return false;
    }

    getPayload(): CustomPayload {
      return this.__payload;
    }

    setPayload(newPayload: Partial<CustomPayload>): void {
      const writable = this.getWritable();
      (writable as CustomElementNode).__payload = { ...this.__payload, ...newPayload };
    }
  }

  // Decorator Node for non-containers
  class CustomDecoratorNode extends DecoratorNode<ReactNode> {
    __payload: CustomPayload;
    __nodeType: string;

    static getType(): string {
      return userConfig.nodeType;
    }

    static clone(node: CustomDecoratorNode): CustomDecoratorNode {
      return new CustomDecoratorNode(node.__payload, node.__nodeType, node.__key);
    }

    constructor(
      payload: CustomPayload = {},
      nodeType: string,
      key?: NodeKey
    ) {
      super(key);
      this.__payload = payload;
      this.__nodeType = nodeType;
    }

    isSelectable(): boolean {
      return true;
    }

    static importJSON(serialized: SerializedCustomNode): CustomDecoratorNode {
      const { payload } = serialized;
      return new CustomDecoratorNode(payload, serialized.type);
    }

    exportJSON(): SerializedLexicalNode {
      return {
        type: this.__nodeType,
        version: 1,
        payload: this.__payload
      } as any;
    }

    createDOM(config: EditorConfig): HTMLElement {
      const element = document.createElement('span');
      element.setAttribute('data-custom-node-type', this.__nodeType);
      
      if (userConfig.createDOM) {
        return userConfig.createDOM(config, this);
      }
      
      return element;
    }

    updateDOM(prevNode: CustomDecoratorNode, dom: HTMLElement, config: EditorConfig): boolean {
      if (userConfig.updateDOM) {
        return userConfig.updateDOM(prevNode, dom, config);
      }
      return false;
    }

    getPayload(): CustomPayload {
      return this.__payload;
    }

    setPayload(newPayload: Partial<CustomPayload>): void {
      const writable = this.getWritable();
      (writable as CustomDecoratorNode).__payload = { ...this.__payload, ...newPayload };
    }

    decorate(): ReactNode {
      return <CustomDecoratorComponent node={this} />;
    }
  }

  // Decorator component
  function CustomDecoratorComponent({ node }: { node: CustomDecoratorNode }) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          setIsSelected(
            $isNodeSelection(selection) && selection.getNodes().some((n) => n.__key === node.__key)
          );
        });
      });
    }, [editor, node]);

    const updatePayload = (newPayload: Partial<CustomPayload>) => {
      editor.update(() => node.setPayload(newPayload));
    };

    return userConfig.render ? userConfig.render({
      node,
      payload: node.__payload,
      children: undefined,
      nodeKey: node.__key,
      isSelected,
      updatePayload,
    }) : null;
  }

  // Helper to create node
  function $createCustomNode(payload: CustomPayload = userConfig.defaultPayload || {}): CustomElementNode | CustomDecoratorNode {
    if (isContainer) {
      const node = new CustomElementNode(payload, userConfig.nodeType);
      
      if (userConfig.initialChildren) {
        const initialChildren = userConfig.initialChildren();
        initialChildren.forEach(childData => {
          if (childData.type === 'paragraph') {
            const paragraph = $createParagraphNode();
            if ((childData as any).children) {
              (childData as any).children.forEach((textChild: any) => {
                if (textChild.type === 'text') {
                  paragraph.append($createTextNode(textChild.text || ''));
                }
              });
            }
            node.append(paragraph);
          }
        });
      } else {
        // Default empty paragraph
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(''));
        node.append(paragraph);
      }
      
      return node;
    } else {
      return new CustomDecoratorNode(payload, userConfig.nodeType);
    }
  }

  // Extension class
  class CustomNodeExtension extends BaseExtension<Name, BaseExtensionConfig, Commands, StateQueries> {
    constructor() {
      super(userConfig.nodeType as Name, [ExtensionCategory.Toolbar]);
    }

    register(editor: LexicalEditor): () => void {
      const unregisterInsert = editor.registerCommand<CustomPayload>(
        INSERT_CUSTOM_NODE,
        (payload) => {
          editor.update(() => {
            const node = $createCustomNode(payload);
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertNodes([node]);
            } else {
              $getRoot().append($createParagraphNode().append(node));
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      return () => {
        unregisterInsert();
      };
    }

    getNodes(): any[] {
      return isContainer ? [CustomElementNode] : [CustomDecoratorNode];
    }

    getCommands(editor: LexicalEditor): Commands {
      const defaultCommands = {
        insertCustomNode: (payload: CustomPayload) => editor.dispatchCommand(INSERT_CUSTOM_NODE, payload),
      } as unknown as Partial<Commands>;

      return { ...defaultCommands, ...(userConfig.commands ? userConfig.commands(editor) : {}) } as Commands;
    }

    getStateQueries(editor: LexicalEditor): StateQueries {
      const defaultQueries = {
        isCustomNodeActive: () => new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            resolve(!!selection && $isNodeSelection(selection) && selection.getNodes().some((n) => n.getType() === userConfig.nodeType));
          });
        }),
      } as unknown as Partial<StateQueries>;

      return { ...defaultQueries, ...(userConfig.stateQueries ? userConfig.stateQueries(editor) : {}) } as StateQueries;
    }
  }

  return { extension: new CustomNodeExtension(), $createCustomNode };
}
