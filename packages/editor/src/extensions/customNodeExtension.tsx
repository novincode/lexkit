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

// Element Node for containers
class CustomElementNode extends ElementNode {
  __payload: CustomPayload;
  __nodeType: string;
  __render?: CustomNodeConfig<any, any>['render'];
  __createDOM?: CustomNodeConfig<any, any>['createDOM'];
  __updateDOM?: CustomNodeConfig<any, any>['updateDOM'];

  static getType(): string {
    return 'custom-element';
  }

  static clone(node: CustomElementNode): CustomElementNode {
    return new CustomElementNode(node.__payload, node.__nodeType, node.__key);
  }

  constructor(
    payload: CustomPayload = {},
    nodeType: string,
    key?: NodeKey,
    render?: CustomNodeConfig<any, any>['render'],
    createDOM?: CustomNodeConfig<any, any>['createDOM'],
    updateDOM?: CustomNodeConfig<any, any>['updateDOM']
  ) {
    super(key);
    this.__payload = payload;
    this.__nodeType = nodeType;
    this.__render = render;
    this.__createDOM = createDOM;
    this.__updateDOM = updateDOM;
  }

  static importJSON(serialized: SerializedCustomNode): CustomElementNode {
    const { payload, children } = serialized;
    const node = new CustomElementNode(payload, serialized.type);
    if (children) {
      children.forEach(childData => {
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
        } else if (childData.type === 'text') {
          node.append($createTextNode((childData as any).text || ''));
        }
      });
    }
    return node;
  }

  exportJSON(): SerializedElementNode {
    const children = this.getChildren().map(child => child.exportJSON());
    return {
      type: this.__nodeType,
      version: 1,
      payload: this.__payload,
      children,
      direction: null,
      format: '',
      indent: 0,
    } as any;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('div');
    element.setAttribute('data-custom-node-type', this.__nodeType);
    if (this.__createDOM) {
      return this.__createDOM(config, this);
    }
    return element;
  }

  updateDOM(prevNode: CustomElementNode, dom: HTMLElement, config: EditorConfig): boolean {
    if (this.__updateDOM) {
      return this.__updateDOM(prevNode, dom, config);
    }
    return false;
  }

  getPayload(): CustomPayload {
    return this.__payload;
  }

  setPayload(newPayload: Partial<CustomPayload>): void {
    this.__payload = { ...this.__payload, ...newPayload };
  }
}

// Decorator Node for non-containers
class CustomDecoratorNode extends DecoratorNode<ReactNode> {
  __payload: CustomPayload;
  __nodeType: string;
  __render?: CustomNodeConfig<any, any>['render'];
  __createDOM?: CustomNodeConfig<any, any>['createDOM'];
  __updateDOM?: CustomNodeConfig<any, any>['updateDOM'];

  static getType(): string {
    return 'custom-decorator';
  }

  static clone(node: CustomDecoratorNode): CustomDecoratorNode {
    return new CustomDecoratorNode(node.__payload, node.__nodeType, node.__key);
  }

  constructor(
    payload: CustomPayload = {},
    nodeType: string,
    key?: NodeKey,
    render?: CustomNodeConfig<any, any>['render'],
    createDOM?: CustomNodeConfig<any, any>['createDOM'],
    updateDOM?: CustomNodeConfig<any, any>['updateDOM']
  ) {
    super(key);
    this.__payload = payload;
    this.__nodeType = nodeType;
    this.__render = render;
    this.__createDOM = createDOM;
    this.__updateDOM = updateDOM;
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
    if (this.__createDOM) {
      return this.__createDOM(config, this);
    }
    return element;
  }

  updateDOM(prevNode: CustomDecoratorNode, dom: HTMLElement, config: EditorConfig): boolean {
    if (this.__updateDOM) {
      return this.__updateDOM(prevNode, dom, config);
    }
    return false;
  }

  getPayload(): CustomPayload {
    return this.__payload;
  }

  setPayload(newPayload: Partial<CustomPayload>): void {
    this.__payload = { ...this.__payload, ...newPayload };
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

  return node.__render ? node.__render({
    node,
    payload: node.__payload,
    children: undefined,
    nodeKey: node.__key,
    isSelected,
    updatePayload,
  }) : null;
}

// Factory function
export function createCustomNodeExtension<
  Name extends string,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {}
>(userConfig: CustomNodeConfig<Commands, StateQueries>) {
  const isContainer = userConfig.isContainer ?? false;
  const INSERT_CUSTOM_NODE = createCommand<CustomPayload>('insert-custom-node');

  // Helper to create node
  function $createCustomNode(payload: CustomPayload): CustomElementNode | CustomDecoratorNode {
    if (isContainer) {
      const node = new CustomElementNode(payload, userConfig.nodeType, undefined, userConfig.render, userConfig.createDOM, userConfig.updateDOM);
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
      return new CustomDecoratorNode(payload, userConfig.nodeType, undefined, userConfig.render, userConfig.createDOM, userConfig.updateDOM);
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

      return unregisterInsert;
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
