import { describe, it, expect } from "vitest";
import {
  createEditor,
  $getRoot,
  type LexicalEditor,
} from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { ImageNode, $createImageNode } from "../../../index";

function makeEditor(): LexicalEditor {
  return createEditor({
    nodes: [ImageNode],
    onError: (e) => {
      throw e;
    },
  });
}

function exportHtml(editor: LexicalEditor): string {
  return editor
    .getEditorState()
    .read(() => $generateHtmlFromNodes(editor));
}

function importHtml(editor: LexicalEditor, html: string): void {
  editor.update(
    () => {
      const root = $getRoot();
      root.clear();
      const dom = new DOMParser().parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      nodes.forEach((n) => root.append(n));
    },
    { discrete: true },
  );
}

function firstImage(editor: LexicalEditor): ImageNode | null {
  return editor.getEditorState().read(() => {
    const found = $getRoot()
      .getChildren()
      .flatMap((n) => (n instanceof ImageNode ? [n] : []));
    if (found.length) return found[0];
    // also look one level down (image nested in a paragraph)
    for (const child of $getRoot().getChildren()) {
      const grandchildren = (child as any).getChildren?.() ?? [];
      for (const gc of grandchildren) if (gc instanceof ImageNode) return gc;
    }
    return null;
  });
}

describe("image HTML round-trip (#10, #11)", () => {
  it("preserves right alignment and dimensions across export -> import (#11, #10)", () => {
    const editor = makeEditor();
    editor.update(
      () => {
        $getRoot().clear();
        $getRoot().append(
          $createImageNode(
            "a.png",
            "cat",
            undefined,
            "right",
            undefined,
            undefined,
            300,
            200,
          ),
        );
      },
      { discrete: true },
    );

    const html = exportHtml(editor);
    importHtml(editor, html);

    const img = firstImage(editor);
    expect(img).not.toBeNull();
    expect(img!.__alignment).toBe("right");
    expect(img!.__width).toBe(300);
    expect(img!.__height).toBe(200);
  });

  it.each(["left", "center", "right", "none"] as const)(
    "round-trips %s alignment without resetting to center (#11)",
    (alignment) => {
      const editor = makeEditor();
      editor.update(
        () => {
          $getRoot().clear();
          $getRoot().append($createImageNode("a.png", "x", undefined, alignment));
        },
        { discrete: true },
      );

      const html = exportHtml(editor);
      importHtml(editor, html);

      expect(firstImage(editor)!.__alignment).toBe(alignment);
    },
  );

  it("imports width/height from img attributes (#10)", () => {
    const editor = makeEditor();
    importHtml(editor, '<img src="x.png" width="300" height="200">');
    const img = firstImage(editor);
    expect(img).not.toBeNull();
    expect(img!.__width).toBe(300);
    expect(img!.__height).toBe(200);
  });

  it("imports width/height from px inline styles (#10)", () => {
    const editor = makeEditor();
    importHtml(editor, '<img src="x.png" style="width:300px;height:200px">');
    const img = firstImage(editor);
    expect(img!.__width).toBe(300);
    expect(img!.__height).toBe(200);
  });

  it("ignores non-pixel (percentage) dimensions (#10)", () => {
    const editor = makeEditor();
    importHtml(editor, '<img src="x.png" style="width:100%">');
    const img = firstImage(editor);
    expect(img!.__width).toBeUndefined();
  });

  it("derives alignment from a float style on a bare img", () => {
    const editor = makeEditor();
    importHtml(editor, '<img src="x.png" style="float:right" width="120">');
    const img = firstImage(editor);
    expect(img!.__alignment).toBe("right");
    expect(img!.__width).toBe(120);
  });
});
