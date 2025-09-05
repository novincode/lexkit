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
  DOMConversionMap,
  DOMExportOutput,
} from 'lexical';
import { ReactNode, useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BaseExtension } from '@repo/editor/extensions/base';
import { BaseExtensionConfig, ExtensionCategory } from '@repo/editor/extensions/types';

// JSX to DOM converter - the magic happens here!
function jsxToDOM(jsxElement: React.ReactElement): HTMLElement {
  // Render JSX to HTML string
  const htmlString = renderToStaticMarkup(jsxElement);
  
  // Create a temporary container
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  
  // Return the first child (the actual element)
  const element = tempDiv.firstElementChild as HTMLElement;
  
  // Clean up
  tempDiv.remove();
  
  return element;
}

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
  // NEW: JSX support for containers
  jsx?: (props: {
    node: LexicalNode;
    payload: CustomPayload;
    nodeKey: string;
    isSelected: boolean;
    updatePayload: (newPayload: Partial<CustomPayload>) => void;
  }) => React.ReactElement;
  createDOM?: (config: EditorConfig, node: LexicalNode) => HTMLElement;
  updateDOM?: (prevNode: LexicalNode, dom: HTMLElement, config: EditorConfig) => boolean;
  importDOM?: () => DOMConversionMap;
  exportDOM?: (editor: LexicalEditor, options: { element: HTMLElement; node: LexicalNode }) => DOMExportOutput;
  commands?: (editor: LexicalEditor) => CustomCommands;
  stateQueries?: (editor: LexicalEditor) => CustomStateQueries;
}

// Factory function
/**
 * Creates a custom node extension for the LexKit editor system.
 * This factory allows you to define custom Lexical nodes with React rendering,
 * commands, and state queries.
 *
 * @template Name - The literal name type for the extension
 * @template Commands - Commands provided by this custom extension
 * @template StateQueries - State query functions for this extension
 * @param userConfig - Configuration object defining the custom node behavior
 * @returns Object containing the extension and helper functions
 *
 * @example
 * ```tsx
 * const { extension, $createCustomNode } = createCustomNodeExtension({
 *   nodeType: 'myBlock',
 *   render: ({ payload, isSelected }) => (
 *     <div className={isSelected ? 'selected' : ''}>
 *       {payload.text}
 *     </div>
 *   ),
 *   commands: (editor) => ({
 *     insertMyBlock: (data) => {
 *       const node = $createCustomNode(data);
 *       editor.dispatchCommand(INSERT_CUSTOM_NODE, node);
 *     }
 *   })
 * });
 * ```
 */
export function createCustomNodeExtension<
  Name extends string,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {}
>(
  userConfig: CustomNodeConfig<Commands, StateQueries>
): {
  extension: BaseExtension<Name, BaseExtensionConfig, Commands, StateQueries>;
  $createCustomNode: (payload?: CustomPayload) => ElementNode | DecoratorNode<ReactNode>;
  jsxToDOM: (jsxElement: React.ReactElement) => HTMLElement;
} {
  const isContainer = userConfig.isContainer ?? false;
  const INSERT_CUSTOM_NODE = createCommand<CustomPayload>('insert-custom-node');

  // React component for rendering (used by both Element and Decorator nodes)
  function CustomNodeComponent({ 
    node, 
    payload, 
    nodeKey, 
    children 
  }: { 
    node: LexicalNode; 
    payload: CustomPayload; 
    nodeKey: string; 
    children?: ReactNode 
  }) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          setIsSelected(
            $isNodeSelection(selection) && selection.getNodes().some((n) => n.__key === nodeKey)
          );
        });
      });
    }, [editor, nodeKey]);

    const updatePayload = (newPayload: Partial<CustomPayload>) => {
      editor.update(() => {
        const writable = node.getWritable();
        (writable as any).__payload = { ...(writable as any).__payload, ...newPayload };
      });
    };

    return userConfig.render ? userConfig.render({
      node,
      payload,
      children,
      nodeKey,
      isSelected,
      updatePayload,
    }) : null;
  }

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

    static importDOM() {
      return userConfig.importDOM ? userConfig.importDOM() : {};
    }

    static exportDOM(editor: LexicalEditor, { node }: { node: LexicalNode }): DOMExportOutput {
      if (userConfig.exportDOM) {
        const element = document.createElement('div');
        return userConfig.exportDOM(editor, { element, node });
      }
      const element = document.createElement('div');
      element.setAttribute('data-custom-node-type', userConfig.nodeType);
      return { element };
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
      if (userConfig.createDOM) {
        const element = userConfig.createDOM(config, this);
        element.setAttribute('data-custom-node-type', this.__nodeType);
        element.setAttribute('data-lexical-key', this.getKey());
        return element;
      }
      
      // NEW: JSX support for containers!
      if (userConfig.jsx) {
        const jsxElement = userConfig.jsx({
          node: this,
          payload: this.__payload,
          nodeKey: this.getKey(),
          isSelected: false, // Will be updated by selection listener
          updatePayload: (newPayload: Partial<CustomPayload>) => {
            this.setPayload(newPayload);
          }
        });
        
        const element = jsxToDOM(jsxElement);
        element.setAttribute('data-custom-node-type', this.__nodeType);
        element.setAttribute('data-lexical-key', this.getKey());
        return element;
      }
      
      const element = document.createElement('div');
      element.setAttribute('data-custom-node-type', this.__nodeType);
      element.setAttribute('data-lexical-key', this.getKey());
      
      // Add basic styling for containers
      element.style.border = '2px solid #ccc';
      element.style.borderRadius = '8px';
      element.style.padding = '16px';
      element.style.margin = '8px 0';
      element.style.position = 'relative';
      
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

    static importDOM() {
      return userConfig.importDOM ? userConfig.importDOM() : {};
    }

    static exportDOM(editor: LexicalEditor, { node }: { node: LexicalNode }): DOMExportOutput {
      if (userConfig.exportDOM) {
        const element = document.createElement('span');
        return userConfig.exportDOM(editor, { element, node });
      }
      const element = document.createElement('span');
      element.setAttribute('data-custom-node-type', userConfig.nodeType);
      return { element };
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
        const customElement = userConfig.createDOM(config, this);
        customElement.setAttribute('data-custom-node-type', this.__nodeType);
        return customElement;
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
      return <CustomNodeComponent 
        node={this} 
        payload={this.__payload} 
        nodeKey={this.__key}
        children={undefined}
      />;
    }
  }

  // Helper to create node
  function $createCustomNode(payload: CustomPayload = userConfig.defaultPayload || {}): CustomElementNode | CustomDecoratorNode {
    if (isContainer) {
      // For containers, always use ElementNode regardless of render prop
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
      // For non-containers, use DecoratorNode
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

      // Handle selection updates for ElementNodes
      const unregisterUpdate = editor.registerUpdateListener(({ editorState, prevEditorState }) => {
        if (isContainer) {
          // For containers, we need to update DOM styling based on selection
          editorState.read(() => {
            const selection = $getSelection();
            const selectedNodes = $isNodeSelection(selection) ? selection.getNodes() : [];
            
            // Update all custom element nodes
            editor.getEditorState().read(() => {
              const root = $getRoot();
              const updateNode = (node: LexicalNode) => {
                if (node.getType() === userConfig.nodeType) {
                  const isSelected = selectedNodes.some(n => n.__key === node.__key);
                  const domElement = document.querySelector(`[data-lexical-key="${node.__key}"]`);
                  if (domElement) {
                    domElement.setAttribute('data-selected', isSelected.toString());
                    (domElement as HTMLElement).style.borderColor = isSelected ? '#007ACC' : '#ccc';
                    (domElement as HTMLElement).style.backgroundColor = isSelected ? '#f0f8ff' : 'transparent';
                  }
                }
                // Only recurse into ElementNodes
                if ('getChildren' in node) {
                  (node as ElementNode).getChildren().forEach(updateNode);
                }
              };
              updateNode(root);
            });
          });
        }
      });

      return () => {
        unregisterInsert();
        unregisterUpdate();
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

  return { extension: new CustomNodeExtension(), $createCustomNode, jsxToDOM };
}
