import { RegisteredCodeSnippet } from "../../../lib/types";

export const COLLABORATION_EXTENSION_CODES: RegisteredCodeSnippet[] = [
  {
    id: "collaboration-install",
    code: `# Pick a transport: y-webrtc (P2P), y-websocket (server), or y-indexeddb (offline)
pnpm add yjs y-webrtc`,
    language: "bash",
    title: "Install",
    description:
      "yjs + a transport are optional peer deps — an editor without the extension pulls in nothing collaboration-related.",
  },
  {
    id: "collaboration-quick-start",
    code: `import {
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

const { Provider, useEditor } = createEditorSystem<typeof extensions>();`,
    language: "tsx",
    title: "Quick start",
    description:
      "Collaboration is just another extension. The only required option is providerFactory — the single seam where you plug in a transport.",
    highlightLines: [11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  {
    id: "collaboration-y-websocket",
    code: `import { WebsocketProvider } from "y-websocket";

providerFactory: (id, docMap) => {
  let doc = docMap.get(id);
  if (!doc) { doc = new Y.Doc(); docMap.set(id, doc); }
  return new WebsocketProvider("wss://your-server", id, doc) as any;
}`,
    language: "typescript",
    title: "y-websocket (client + server)",
    description: "Production-style client/server transport.",
  },
  {
    id: "collaboration-y-webrtc",
    code: `import { WebrtcProvider } from "y-webrtc";

providerFactory: (id, docMap) => {
  let doc = docMap.get(id);
  if (!doc) { doc = new Y.Doc(); docMap.set(id, doc); }
  // Same-origin tabs sync via BroadcastChannel with no signaling at all.
  // Add signaling servers for cross-device collaboration.
  return new WebrtcProvider(id, doc, {
    signaling: ["wss://your-signaling-server"],
  }) as any;
}`,
    language: "typescript",
    title: "y-webrtc (peer-to-peer)",
    description: "Zero-infra for same-origin tabs; add signaling for cross-device.",
  },
  {
    id: "collaboration-y-indexeddb",
    code: `import { IndexeddbPersistence } from "y-indexeddb";

providerFactory: (id, docMap) => {
  let doc = docMap.get(id);
  if (!doc) { doc = new Y.Doc(); docMap.set(id, doc); }
  // Persist locally so edits survive reloads and replay when back online.
  new IndexeddbPersistence(id, doc);
  return new WebsocketProvider("wss://your-server", id, doc) as any;
}`,
    language: "typescript",
    title: "y-indexeddb (offline persistence)",
    description: "Combine with another provider to persist a client's edits locally.",
  },
  {
    id: "collaboration-presence-hook",
    code: `import { useCollaborators } from "@lexkit/editor";

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
}`,
    language: "tsx",
    title: "Presence with useCollaborators()",
    description: "Build any presence UI from the headless awareness API.",
    highlightLines: [4, 8, 9, 10],
  },
  {
    id: "collaboration-commands",
    code: `const { commands, activeStates } = useEditor();

commands.collab.connect();
commands.collab.disconnect();
commands.collab.toggle();
commands.collab.setLocalUser({ name: "Ada", color: "#e11d48", awarenessData: { avatar } });
commands.collab.getUsers();         // CollaboratorState[]
commands.collab.onUsersChange(cb);  // subscribe; returns unsubscribe
activeStates.isCollaborating;       // boolean`,
    language: "typescript",
    title: "Imperative API",
    description: "Drive collaboration through commands and state queries.",
  },
  {
    id: "collaboration-theme",
    code: `const theme = {
  collab: {
    cursorsContainer: "my-cursors-layer",
    caret: "my-collab-caret",
    label: "my-collab-label",
    selection: "my-collab-selection",
  },
};`,
    language: "typescript",
    title: "Themeable cursors",
    description: "Style remote carets via theme classes; color comes from cursorColor.",
  },
];

export default COLLABORATION_EXTENSION_CODES;
