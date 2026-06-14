import { describe, it, expect } from "vitest";
import {
  createEditor,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  type LexicalEditor,
} from "lexical";
import {
  $convertToMarkdownString,
  $convertFromMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import {
  ImageNode,
  $createImageNode,
  ALL_MARKDOWN_TRANSFORMERS,
} from "../../../index";

const TRANSFORMERS_WITH_IMAGES = [...ALL_MARKDOWN_TRANSFORMERS, ...TRANSFORMERS];

function makeEditor(): LexicalEditor {
  return createEditor({
    nodes: [ImageNode],
    onError: (e) => {
      throw e;
    },
  });
}

function exportMarkdown(editor: LexicalEditor): string {
  return editor
    .getEditorState()
    .read(() => $convertToMarkdownString(TRANSFORMERS_WITH_IMAGES));
}

describe("image markdown transformers (#13)", () => {
  it("exports a top-level (block) image", () => {
    const editor = makeEditor();
    editor.update(
      () => {
        const root = $getRoot();
        root.clear();
        root.append($createImageNode("https://cdn/top.png", "top", "", "left"));
      },
      { discrete: true },
    );

    expect(exportMarkdown(editor)).toBe(
      "![top](https://cdn/top.png) <!-- align:left -->",
    );
  });

  it("exports an image nested as the only child of a paragraph (the #13 regression)", () => {
    const editor = makeEditor();
    editor.update(
      () => {
        const root = $getRoot();
        root.clear();
        const p = $createParagraphNode();
        p.append(
          $createImageNode("https://cdn/x.png", "My alt", "My caption", "right"),
        );
        root.append(p);
      },
      { discrete: true },
    );

    // Before the fix this produced "" because element transformers never reach
    // nodes nested inside a paragraph.
    expect(exportMarkdown(editor)).toBe(
      '![My alt](https://cdn/x.png "My caption") <!-- align:right -->',
    );
  });

  it("exports an image placed inline between text nodes", () => {
    const editor = makeEditor();
    editor.update(
      () => {
        const root = $getRoot();
        root.clear();
        const p = $createParagraphNode();
        p.append($createTextNode("before "));
        p.append($createImageNode("https://cdn/mid.png", "m"));
        p.append($createTextNode(" after"));
        root.append(p);
      },
      { discrete: true },
    );

    expect(exportMarkdown(editor)).toBe("before ![m](https://cdn/mid.png) after");
  });

  it("imports a standalone image line as a top-level image and round-trips", () => {
    const editor = makeEditor();
    const md = '![cat](pic.png "cap") <!-- align:right -->';
    editor.update(
      () => {
        $getRoot().clear();
        $convertFromMarkdownString(md, TRANSFORMERS_WITH_IMAGES);
      },
      { discrete: true },
    );

    const node = editor.getEditorState().read(() => {
      const first = $getRoot().getFirstChild();
      return first instanceof ImageNode ? first : null;
    });
    expect(node).not.toBeNull();
    expect(node!.__alignment).toBe("right");
    expect(exportMarkdown(editor)).toBe(md);
  });

  it("imports an inline image within text and round-trips", () => {
    const editor = makeEditor();
    const md = "Look: ![cat](c.png) here";
    editor.update(
      () => {
        $getRoot().clear();
        $convertFromMarkdownString(md, TRANSFORMERS_WITH_IMAGES);
      },
      { discrete: true },
    );

    expect(exportMarkdown(editor)).toBe(md);
  });

  it("ships both an element and a text-match image transformer", () => {
    const types = ALL_MARKDOWN_TRANSFORMERS.map((t) => t.type);
    expect(types).toContain("element");
    expect(types).toContain("text-match");
  });
});
