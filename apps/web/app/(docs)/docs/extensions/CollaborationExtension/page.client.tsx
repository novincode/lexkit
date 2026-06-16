"use client";

import dynamic from "next/dynamic";
import { Badge } from "@repo/ui/components/badge";
import { Users, Wifi, Palette, Plug } from "lucide-react";

// Load the live demo on the client only — the y-webrtc transport touches
// browser APIs and must not run during SSR/prerender.
const BasicCollaborativeEditor = dynamic(
  () =>
    import("./examples/BasicCollaborativeEditor").then(
      (m) => m.BasicCollaborativeEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border p-4 text-muted-foreground">
        Loading collaborative editor…
      </div>
    ),
  },
);

function Code({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-lg border overflow-hidden my-4">
      {title ? (
        <div className="px-4 py-2 text-xs font-mono bg-muted/60 border-b text-muted-foreground">
          {title}
        </div>
      ) : null}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function CollaborationExtensionPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-6 py-8">
        <h1 className="text-4xl font-bold">CollaborationExtension</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Headless, transport-agnostic real-time collaboration for LexKit, built
          on Lexical&apos;s own collaboration binding and{" "}
          <a className="underline" href="https://yjs.dev" target="_blank" rel="noreferrer">
            Yjs
          </a>{" "}
          (a CRDT — offline edits merge conflict-free on reconnect).
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Plug className="h-3 w-3 mr-1" /> Pluggable transport
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Users className="h-3 w-3 mr-1" /> Presence API
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Palette className="h-3 w-3 mr-1" /> Themeable cursors
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Wifi className="h-3 w-3 mr-1" /> Offline-safe (CRDT)
          </Badge>
        </div>
      </div>

      {/* Live demo */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Live demo</h2>
        <p className="text-muted-foreground">
          Open this page in a second browser tab and start typing. Same-origin
          tabs sync peer-to-peer via the browser&apos;s BroadcastChannel, so this
          demo needs <strong>no server at all</strong>.
        </p>
        <BasicCollaborativeEditor />
      </section>

      {/* Install */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Install</h2>
        <p className="text-muted-foreground">
          The extension ships with LexKit. You add <code>yjs</code> and a
          transport of your choice (they are optional peer dependencies — an
          editor without the extension pulls in nothing collaboration-related).
        </p>
        <Code title="terminal">{`# pick a transport: y-webrtc (P2P), y-websocket (server), or y-indexeddb (offline)
pnpm add yjs y-webrtc`}</Code>
      </section>

      {/* Quick start */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Quick start</h2>
        <p className="text-muted-foreground">
          Collaboration is just another extension. The only required option is{" "}
          <code>providerFactory</code> — the single seam where you plug in a
          transport. LexKit never bundles one.
        </p>
        <Code title="editor.tsx">{`import {
  createEditorSystem,
  richTextExtension,
  collaborationExtension,
  type CollaborationProvider,
} from "@lexkit/editor";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

const extensions = [
  richTextExtension,
  collaborationExtension.configure({
    id: "my-room",
    username: "Ada",
    cursorColor: "#e11d48",
    providerFactory: (id, docMap) => {
      let doc = docMap.get(id);
      if (!doc) { doc = new Y.Doc(); docMap.set(id, doc); }
      return new WebrtcProvider(id, doc) as unknown as CollaborationProvider;
    },
  }),
] as const;

const { Provider, useEditor } = createEditorSystem<typeof extensions>();`}</Code>
        <p className="text-muted-foreground">
          The extension stays inert until <code>providerFactory</code> is set, so
          it&apos;s safe to leave in the array and toggle collaboration on later.
        </p>
      </section>

      {/* Providers */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Choose a transport</h2>
        <p className="text-muted-foreground">
          Anything implementing the Yjs <code>Provider</code> interface works.
        </p>
        <Code title="y-websocket (client + server)">{`import { WebsocketProvider } from "y-websocket";

providerFactory: (id, docMap) => {
  let doc = docMap.get(id);
  if (!doc) { doc = new Y.Doc(); docMap.set(id, doc); }
  return new WebsocketProvider("wss://your-server", id, doc) as any;
}`}</Code>
        <Code title="y-webrtc (peer-to-peer, add signaling for cross-device)">{`import { WebrtcProvider } from "y-webrtc";

providerFactory: (id, docMap) => {
  let doc = docMap.get(id);
  if (!doc) { doc = new Y.Doc(); docMap.set(id, doc); }
  return new WebrtcProvider(id, doc, {
    signaling: ["wss://your-signaling-server"],
  }) as any;
}`}</Code>
        <Code title="y-indexeddb (offline persistence — combine with another provider)">{`import { IndexeddbPersistence } from "y-indexeddb";

providerFactory: (id, docMap) => {
  let doc = docMap.get(id);
  if (!doc) { doc = new Y.Doc(); docMap.set(id, doc); }
  // Persist locally so edits survive reloads and replay when back online.
  new IndexeddbPersistence(id, doc);
  return new WebsocketProvider("wss://your-server", id, doc) as any;
}`}</Code>
      </section>

      {/* Presence */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Presence</h2>
        <p className="text-muted-foreground">
          Build any presence UI with the headless <code>useCollaborators()</code>{" "}
          hook, or drive it imperatively through{" "}
          <code>commands.collab</code>.
        </p>
        <Code title="presence-bar.tsx">{`import { useCollaborators } from "@lexkit/editor";

function PresenceBar() {
  const { users, isConnected } = useCollaborators();
  return (
    <div>
      {isConnected ? "live" : "offline"} · {users.length} online
      {users.map((u) => (
        <span key={u.clientId} style={{ color: u.color }}>
          {u.name}{u.isLocal ? " (you)" : ""}
        </span>
      ))}
    </div>
  );
}`}</Code>
        <Code title="commands.collab">{`const { commands, activeStates } = useEditor();

commands.collab.connect();
commands.collab.disconnect();
commands.collab.toggle();
commands.collab.setLocalUser({ name: "Ada", color: "#e11d48", awarenessData: { avatar } });
commands.collab.getUsers();         // CollaboratorState[]
commands.collab.onUsersChange(cb);  // subscribe; returns unsubscribe
activeStates.isCollaborating;       // boolean`}</Code>
      </section>

      {/* Theming cursors */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Themeable cursors</h2>
        <p className="text-muted-foreground">
          Remote carets are rendered by Lexical&apos;s reliable cursor binding
          into a container you can style via the theme, and each user&apos;s
          color comes from <code>cursorColor</code>. Supply your own{" "}
          <code>cursorsContainerRef</code> to portal carets anywhere.
        </p>
        <Code title="theme.ts">{`const theme = {
  collab: {
    cursorsContainer: "my-cursors-layer",
    caret: "my-collab-caret",
    label: "my-collab-label",
    selection: "my-collab-selection",
  },
};`}</Code>
      </section>

      {/* Offline */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Offline &amp; reliability</h2>
        <p className="text-muted-foreground">
          Yjs is a CRDT: when a client drops offline and keeps editing, then
          reconnects, all edits merge automatically with no data loss and every
          replica converges to the same state. Add{" "}
          <code>y-indexeddb</code> to persist a client&apos;s edits locally so
          they survive reloads and replay on reconnect. This behaviour is
          identical no matter how content is imported (Markdown, HTML or JSON) —
          collaboration syncs the editor state itself.
        </p>
      </section>

      {/* Notes */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Notes</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Undo/redo &amp; history:</strong> Yjs owns history while
            collaborating. Lexical&apos;s collaboration binding does not wire a
            Yjs undo manager, so do <strong>not</strong> register{" "}
            <code>historyExtension</code> at the same time as the collaboration
            extension.
          </li>
          <li>
            <strong>Initial content:</strong> exactly one client should seed the
            document (<code>shouldBootstrap</code>, default <code>true</code>).
            Set it to <code>false</code> on clients that join an existing room.
          </li>
          <li>
            <strong>Multiple editors on one page:</strong> wrap each editor in
            its own collaboration context so they don&apos;t share a Yjs document
            map.
          </li>
          <li>
            <strong>Custom nodes:</strong> exclude transient props (e.g. an
            image&apos;s <code>uploading</code> flag) from sync via{" "}
            <code>excludedProperties</code>.
          </li>
        </ul>
      </section>
    </div>
  );
}
