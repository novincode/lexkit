import { RegisteredCodeSnippet } from '../../lib/types'

// General extension examples
export const EXTENSION_EXAMPLES: RegisteredCodeSnippet[] = [
  {
    id: 'create-extension-basic',
    code: `import { createExtension } from '@lexkit/editor'

const MyExtension = createExtension({
  name: 'my-extension',
  commands: (editor) => ({
    // Define your commands here
    myCommand: () => console.log('Hello!')
  })
})`,
    language: 'typescript',
    title: 'Create Basic Extension',
    description: 'Minimal extension with a single command',
    highlightLines: [4, 5, 6, 7]
  },
  {
    id: 'extension-commands',
    code: `commands: (editor) => ({
  insertText: (text: string) => {
    editor.update(() => {
      // Insert text at cursor
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        selection.insertText(text)
      }
    })
  },

  clearEditor: () => {
    editor.update(() => {
      $getRoot().clear()
    })
  }
})`,
    language: 'typescript',
    title: 'Extension Commands',
    description: 'Define commands that manipulate the editor',
    highlightLines: [2, 3, 4, 5, 6, 10, 11, 12]
  },
  {
    id: 'extension-state-queries',
    code: `stateQueries: (editor) => ({
  hasSelection: async () => {
    return new Promise(resolve => {
      editor.read(() => {
        const selection = $getSelection()
        resolve($isRangeSelection(selection))
      })
    })
  },

  isEmpty: async () => {
    return new Promise(resolve => {
      editor.read(() => {
        const root = $getRoot()
        resolve(!$getRoot().getTextContent().trim())
      })
    })
  }
})`,
    language: 'typescript',
    title: 'State Queries',
    description: 'Query editor state for UI decisions',
    highlightLines: [2, 3, 4, 5, 6, 10, 11, 12, 13]
  },
  {
    id: 'extension-setup',
    code: `// 1. Define your extensions
const extensions = [MyExtension] as const

// 2. Create editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// 3. Use in component
function MyEditor() {
  return (
    <Provider extensions={extensions}>
      <EditorContent />
    </Provider>
  )
}`,
    language: 'typescript',
    title: 'Setup Extension System',
    description: 'Three steps to integrate extensions',
    highlightLines: [2, 5, 8, 9, 10, 11]
  },
  {
    id: 'base-extension-commands',
    code: `getCommands(editor: LexicalEditor): TestCommands {
  return {
    insertTimestamp: () => {
      editor.focus();
      const timestamp = new Date().toLocaleString();
      editor.update(() => {
        const root = $getRoot();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(timestamp));
        root.append(paragraph);
      });
    },

    clearContent: () => {
      editor.update(() => {
        $getRoot().clear();
      });
    },

    getWordCount: () => {
      alert('Hello World from BaseExtension!');
    }
  };
}`,
    language: 'typescript',
    title: 'BaseExtension Commands',
    description: 'Implement getCommands method for BaseExtension',
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 17, 18, 19]
  },
  {
    id: 'base-extension-state-queries',
    code: `getStateQueries(editor: LexicalEditor): TestStateQueries {
  return {
    hasSelection: async () => {
      return new Promise(resolve => {
        editor.read(() => {
          const selection = $getSelection();
          resolve($isRangeSelection(selection) && !selection.isCollapsed());
        });
      });
    },

    isEmpty: async () => {
      return new Promise(resolve => {
        editor.read(() => {
          const root = $getRoot();
          resolve(!root.getTextContent().trim());
        });
      });
    }
  };
}`,
    language: 'typescript',
    title: 'BaseExtension State Queries',
    description: 'Implement getStateQueries method for BaseExtension',
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15]
  },
  {
    id: 'use-extension-commands',
    code: `function MyEditor() {
  const { commands, stateQueries } = useEditor()

  const handleInsertText = () => {
    commands.insertText('Hello World!')
  }

  const handleClear = () => {
    commands.clearEditor()
  }

  const checkSelection = async () => {
    const hasSelection = await stateQueries.hasSelection()
    console.log('Has selection:', hasSelection)
  }

  return (
    <div>
      <div className="mb-4 space-x-2">
        <button onClick={handleInsertText}>
          Insert Text
        </button>
        <button onClick={handleClear}>
          Clear Editor
        </button>
        <button onClick={checkSelection}>
          Check Selection
        </button>
      </div>

      <EditorContent />
    </div>
  )
}`,
    language: 'tsx',
    title: 'Using Extension Commands',
    description: 'Access and use extension commands in your components',
    highlightLines: [2, 4, 5, 6, 9, 10, 11, 14, 15, 16, 17, 18, 19]
  }
]

// Combine all examples for default export
export default EXTENSION_EXAMPLES
