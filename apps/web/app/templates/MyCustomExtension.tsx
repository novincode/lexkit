import React from 'react';
import { createCustomNodeExtension } from '../../../../packages/editor/src/extensions/customNodeExtension';
import { $getSelection, $isRangeSelection, $getRoot, $createParagraphNode } from 'lexical';

// Simple wrapper component for the custom node
const MyCustomComponent = ({
  children,
  isSelected
}: {
  node: any;
  payload: any;
  children?: React.ReactNode;
  nodeKey: string;
  isSelected: boolean;
  updatePayload: (newPayload: Partial<any>) => void;
}): React.ReactNode => {
  return (
    <div
      style={{
        border: isSelected ? '2px solid #007ACC' : '2px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        backgroundColor: isSelected ? '#f0f8ff' : '#f8f9fa'
      }}
    >
      <div style={{
        fontSize: '12px',
        color: '#666',
        marginBottom: '8px',
        fontWeight: 'bold'
      }}>
        Custom Container
      </div>
      {children}
    </div>
  );
};

// Create the extension using the factory
type MyCommands = {
  insertMyBlock: (payload: { text: string; color: string }) => void;
};

const { extension: MyCustomExtension, $createCustomNode } = createCustomNodeExtension<'myBlock', MyCommands, {}>({
  nodeType: 'myBlock',
  isContainer: true,
  initialChildren: () => [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Hello World' }],
      direction: null,
      format: '',
      indent: 0,
      version: 1
    }
  ],
  createDOM: (config, node) => {
    const element = document.createElement('div');
    element.setAttribute('data-custom-node-type', 'myBlock');
    element.style.border = '2px solid #ccc';
    element.style.borderRadius = '8px';
    element.style.padding = '16px';
    element.style.margin = '8px 0';
    element.style.backgroundColor = '#f8f9fa';
    
    // Add label
    const label = document.createElement('div');
    label.textContent = 'Custom Container';
    label.style.fontSize = '12px';
    label.style.color = '#666';
    label.style.marginBottom = '8px';
    label.style.fontWeight = 'bold';
    element.appendChild(label);
    
    return element;
  },
  commands: (editor) => ({
    insertMyBlock: (payload: { text: string; color: string }) => {
      editor.update(() => {
        const node = $createCustomNode(payload);
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([node]);
        } else {
          $getRoot().append($createParagraphNode().append(node));
        }
      });
    },
  }),
});

export { MyCustomExtension };

// Usage example:
// 1. Register the extension with your editor
// 2. Use the insertCustomNode command to insert nodes
// 3. The container will render with native Lexical editing capabilities
// 4. Style the container using CSS: [data-custom-node-type="myBlock"]
