"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  underlineExtension,
  RichText,
} from "@lexkit/editor";
import { LexKitTheme } from "@lexkit/editor";

// Clean light theme
const lightTheme: LexKitTheme = {
  paragraph: "mb-4 text-gray-800",
  text: {
    bold: "font-bold text-blue-700",
    italic: "italic text-green-700",
  },
  toolbar: {
    button:
      "px-3 py-2 text-sm font-medium rounded-md border border-gray-300   text-gray-700 transition-colors",
    buttonActive: "bg-purple-500 text-white border-blue-500 hover:bg-blue-600",
    group: "flex gap-1",
  },
  container: "border border-gray-300 rounded-lg bg-white shadow-sm",
  wrapper: "p-4",
  richText: {
    contentEditable: "outline-none min-h-[200px] text-gray-800 leading-relaxed",
    placeholder: "text-gray-400 italic",
  },
};

// Clean dark theme
const darkTheme: LexKitTheme = {
  paragraph: "mb-4 text-gray-100",
  text: {
    bold: "font-bold text-yellow-300",
    italic: "italic text-pink-300",
  },
  toolbar: {
    button:
      "px-3 py-2 text-sm font-medium rounded-md border border-gray-600 bg-gray-800  text-gray-200 transition-colors",
    buttonActive:
      "bg-purple-500 text-white border-purple-500 hover:bg-purple-600",
    group: "flex gap-1",
  },
  container: "border border-gray-600 rounded-lg bg-gray-900 shadow-lg",
  wrapper: "p-4",
  richText: {
    contentEditable: "outline-none min-h-[200px] text-gray-100 leading-relaxed",
    placeholder: "text-gray-500 italic",
  },
};

const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
] as const;
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Simple toolbar that uses theme classes properly
function SimpleToolbar({ theme }: { theme: LexKitTheme }) {
  const { commands, activeStates } = useEditor();

  return (
    <div className={`flex gap-2 p-3 border-b ${theme.toolbar?.group || ""}`}>
      <button
        onClick={() => commands.toggleBold()}
        className={`${theme.toolbar?.button || ""} ${activeStates.bold ? theme.toolbar?.buttonActive || "" : ""}`}
      >
        Bold
      </button>
      <button
        onClick={() => commands.toggleItalic()}
        className={`${theme.toolbar?.button || ""} ${activeStates.italic ? theme.toolbar?.buttonActive || "" : ""}`}
      >
        Italic
      </button>
    </div>
  );
}

// Clean editor component
function SimpleEditor({ theme }: { theme: LexKitTheme }) {
  return (
    <div className={theme.container || ""}>
      <SimpleToolbar theme={theme} />
      <div className={theme.wrapper || ""}>
        <RichText
          placeholder="Type here to see theme switching..."
          classNames={{
            contentEditable: theme.richText?.contentEditable || "",
            placeholder: theme.richText?.placeholder || "",
          }}
        />
      </div>
    </div>
  );
}

export function DarkModeExample() {
  const [isDark, setIsDark] = useState(false);
  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Theme: {isDark ? "Dark" : "Light"}
        </h3>
        <Button onClick={() => setIsDark(!isDark)} size="sm">
          Switch to {isDark ? "Light" : "Dark"}
        </Button>
      </div>

      {/* Theme system handles all styling automatically */}
      <Provider extensions={extensions} config={{ theme: currentTheme }}>
        <SimpleEditor theme={currentTheme} />
      </Provider>

      <p className="text-sm text-muted-foreground">
        Same component, different theme - no manual styling needed!
      </p>
    </div>
  );
}
