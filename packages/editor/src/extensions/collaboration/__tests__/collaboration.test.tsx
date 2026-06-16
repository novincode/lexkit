import React, { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { describe, it, expect, afterEach, vi } from "vitest";
import * as Y from "yjs";
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  type LexicalEditor,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CollaborationContext } from "@lexical/react/LexicalCollaborationContext";
import type { Provider } from "@lexical/yjs";
import {
  createEditorSystem,
  richTextExtension,
  CollaborationExtension,
} from "../../../index";

// React needs this flag for act() to flush effects synchronously in tests.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

// ---------------------------------------------------------------------------
// In-memory transport: relays Y.Doc updates + Yjs awareness between providers
// in the same process, with no network. This is the standard way to test Yjs
// integrations deterministically. Each "client" gets its own Y.Doc (exactly
// like the real world); the room is the wire between them.
// ---------------------------------------------------------------------------

class MemoryAwareness {
  clientID: number;
  private readonly listeners = new Set<() => void>();
  constructor(
    private readonly room: MemoryRoom,
    clientID: number,
  ) {
    this.clientID = clientID;
  }
  getLocalState() {
    return this.room.states.get(this.clientID) ?? null;
  }
  getStates() {
    return this.room.states;
  }
  setLocalState(state: Record<string, unknown> | null) {
    if (state == null) this.room.states.delete(this.clientID);
    else this.room.states.set(this.clientID, state);
    this.room.fireAwareness();
  }
  setLocalStateField(field: string, value: unknown) {
    const current = this.getLocalState() ?? {};
    this.setLocalState({ ...current, [field]: value });
  }
  on(type: "update", cb: () => void) {
    if (type === "update") this.listeners.add(cb);
  }
  off(type: "update", cb: () => void) {
    if (type === "update") this.listeners.delete(cb);
  }
  _fire() {
    this.listeners.forEach((cb) => cb());
  }
}

// Yjs requires a unique clientID per document. lib0's RNG can collide in the
// jsdom test environment (two `new Y.Doc()` returning the same clientID), which
// corrupts merges, so we assign a guaranteed-unique id per created doc.
let CLIENT_ID_SEQ = 1;

class MemoryProvider {
  readonly doc: Y.Doc;
  readonly awareness: MemoryAwareness;
  connected = false;
  private readonly handlers: Record<string, Set<(arg?: any) => void>> = {};

  constructor(
    readonly room: MemoryRoom,
    readonly id: string,
    docMap: Map<string, Y.Doc>,
  ) {
    let doc = docMap.get(id);
    if (!doc) {
      doc = new Y.Doc();
      doc.clientID = CLIENT_ID_SEQ++;
      docMap.set(id, doc);
    }
    this.doc = doc;
    this.awareness = new MemoryAwareness(room, doc.clientID);
    room.providers.add(this);

    // Only relay edits that originated locally (origin === the Lexical binding,
    // never another MemoryProvider) so we don't echo network updates forever.
    this.doc.on("update", (update: Uint8Array, origin: unknown) => {
      if (origin instanceof MemoryProvider) return;
      if (!this.connected || !this.room.online) return;
      this.room.broadcastDocUpdate(this, update);
    });
  }

  on(type: string, cb: (arg?: any) => void) {
    (this.handlers[type] ??= new Set()).add(cb);
  }
  off(type: string, cb: (arg?: any) => void) {
    this.handlers[type]?.delete(cb);
  }
  private emit(type: string, arg?: any) {
    this.handlers[type]?.forEach((cb) => cb(arg));
  }

  connect() {
    this.connected = true;
    this.room.syncDocs();
    this.emit("status", { status: "connected" });
    this.emit("sync", true);
    this.room.fireAwareness();
  }
  disconnect() {
    this.connected = false;
    this.emit("status", { status: "disconnected" });
    this.emit("sync", false);
  }
  _fireAwareness() {
    this.awareness._fire();
  }
}

class MemoryRoom {
  readonly providers = new Set<MemoryProvider>();
  readonly states = new Map<number, Record<string, unknown>>();
  online = true;

  // Relay updates asynchronously, like a real network provider. Applying a
  // remote update synchronously inside the originating editor's update cycle
  // re-enters Lexical's Yjs binding and corrupts it, so we defer.
  broadcastDocUpdate(origin: MemoryProvider, update: Uint8Array) {
    if (!this.online) return;
    this.providers.forEach((p) => {
      if (p !== origin && p.connected) {
        setTimeout(() => {
          if (this.online && p.connected) Y.applyUpdate(p.doc, update, origin);
        }, 0);
      }
    });
  }

  /** Full state exchange between all connected peers (connect + reconnect). */
  syncDocs() {
    if (!this.online) return;
    const connected = [...this.providers].filter((p) => p.connected);
    for (const a of connected) {
      for (const b of connected) {
        if (a !== b) {
          const update = Y.encodeStateAsUpdate(a.doc);
          setTimeout(() => {
            if (this.online && b.connected) Y.applyUpdate(b.doc, update, a);
          }, 0);
        }
      }
    }
  }

  fireAwareness() {
    this.providers.forEach((p) => p._fireAwareness());
  }

  goOffline() {
    this.online = false;
  }
  goOnline() {
    this.online = true;
    this.syncDocs();
  }
}

// ---------------------------------------------------------------------------
// Editor harness
// ---------------------------------------------------------------------------

function Capture({ onEditor }: { onEditor: (editor: LexicalEditor) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    onEditor(editor);
  }, [editor, onEditor]);
  return null;
}

interface Client {
  editor: LexicalEditor;
  extension: CollaborationExtension;
  provider: MemoryProvider;
  root: Root;
  container: HTMLElement;
}

async function mountClient(
  room: MemoryRoom,
  username: string,
  cursorColor: string,
  shouldBootstrap: boolean,
): Promise<Client> {
  let captured: MemoryProvider | null = null;
  const extension = new CollaborationExtension({
    username,
    cursorColor,
    shouldBootstrap,
    providerFactory: (id, docMap) => {
      const provider = new MemoryProvider(room, id, docMap as Map<string, Y.Doc>);
      captured = provider;
      return provider as unknown as Provider;
    },
  });

  const extensions = [richTextExtension, extension] as const;
  const { Provider } = createEditorSystem<typeof extensions>();

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  let editor: LexicalEditor | null = null;
  await act(async () => {
    root.render(
      // Each editor needs its own collaboration context: @lexical/react's
      // default context shares a single module-level yjsDocMap, which would
      // make two editors in one process bind to the *same* Y.Doc.
      <CollaborationContext.Provider
        value={{
          clientID: 0,
          color: cursorColor,
          name: username,
          isCollabActive: false,
          yjsDocMap: new Map(),
        }}
      >
        <Provider extensions={extensions}>
          <Capture onEditor={(e) => (editor = e)} />
        </Provider>
      </CollaborationContext.Provider>,
    );
  });
  await flush();

  if (!editor || !captured) throw new Error("client failed to mount");
  return { editor, extension, provider: captured, root, container };
}

/** Let microtasks/timers settle so cross-editor sync fully propagates. */
async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function appendParagraph(client: Client, text: string) {
  client.editor.update(
    () => {
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(text));
      $getRoot().append(paragraph);
    },
    { discrete: true },
  );
}

function readText(client: Client): string {
  return client.editor.getEditorState().read(() => $getRoot().getTextContent());
}

const clients: Client[] = [];
async function makeClient(room: MemoryRoom, name: string, color: string) {
  // Exactly one client should bootstrap the empty doc (the first to join).
  const shouldBootstrap = ![...room.providers].length;
  const client = await mountClient(room, name, color, shouldBootstrap);
  clients.push(client);
  return client;
}

afterEach(async () => {
  // CollaborationPlugin logs connect/disconnect; keep test output quiet.
  vi.restoreAllMocks();
  for (const client of clients.splice(0)) {
    await act(async () => {
      client.root.unmount();
    });
    client.container.remove();
  }
});

describe("CollaborationExtension (headless Yjs sync)", () => {
  it("syncs text from one editor to another through the provider", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const room = new MemoryRoom();
    const alice = await makeClient(room, "Alice", "#e11d48");
    const bob = await makeClient(room, "Bob", "#2563eb");

    await act(async () => appendParagraph(alice, "Hello collab"));
    await flush();

    expect(readText(bob)).toContain("Hello collab");
  });

  it("converges bidirectional edits (CRDT, no lost data)", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const room = new MemoryRoom();
    const alice = await makeClient(room, "Alice", "#e11d48");
    const bob = await makeClient(room, "Bob", "#2563eb");

    await act(async () => appendParagraph(alice, "shared"));
    await flush();
    await act(async () => appendParagraph(bob, "from bob"));
    await flush();

    expect(readText(alice)).toContain("shared");
    expect(readText(alice)).toContain("from bob");
    expect(readText(bob)).toContain("shared");
    expect(readText(bob)).toContain("from bob");
  });

  it("replays offline edits on reconnect with no data loss", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const room = new MemoryRoom();
    const alice = await makeClient(room, "Alice", "#e11d48");
    const bob = await makeClient(room, "Bob", "#2563eb");

    await act(async () => appendParagraph(alice, "base"));
    await flush();
    expect(readText(bob)).toContain("base");

    // Alice drops offline and keeps editing; Bob receives nothing meanwhile.
    room.goOffline();
    await act(async () => appendParagraph(alice, "offline edit"));
    await flush();
    expect(readText(bob)).not.toContain("offline edit");

    // Back online: Alice's offline work replays to Bob and both converge.
    room.goOnline();
    await flush();
    await flush();

    // The Yjs documents (the CRDT source of truth) converge to an identical
    // state with no data loss — this is the reliability guarantee Yjs provides
    // when a client goes offline, keeps editing, and reconnects.
    expect(Y.encodeStateVector(bob.provider.doc)).toEqual(
      Y.encodeStateVector(alice.provider.doc),
    );

    // And the offline edit replays into the remote editor on reconnect.
    expect(readText(bob)).toContain("offline edit");
  });

  it("exposes collaborators via the presence API", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const room = new MemoryRoom();
    const alice = await makeClient(room, "Alice", "#e11d48");
    const bob = await makeClient(room, "Bob", "#2563eb");
    await flush();

    const usersFromAlice = alice.extension.getUsers();
    const names = usersFromAlice.map((u) => u.name).sort();
    expect(names).toEqual(["Alice", "Bob"]);

    const local = usersFromAlice.find((u) => u.isLocal);
    expect(local?.name).toBe("Alice");
    expect(local?.color).toBe("#e11d48");

    // Live updates to local presence are reflected in awareness.
    alice.extension
      .getCommands(alice.editor)
      .collab.setLocalUser({ name: "Alice II" });
    await flush();
    expect(
      bob.extension.getUsers().find((u) => !u.isLocal)?.name,
    ).toBe("Alice II");
  });

  it("reports isCollaborating once connected", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const room = new MemoryRoom();
    const alice = await makeClient(room, "Alice", "#e11d48");
    await flush();

    const connected = await alice.extension
      .getStateQueries(alice.editor)
      .isCollaborating();
    expect(connected).toBe(true);
  });
});
