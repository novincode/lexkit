"use client";

// Basic Collaborative Editor Example (zero-infra)
// Real-time collaboration powered by the headless CollaborationExtension +
// a y-webrtc provider. Open this page in two browser tabs/windows on the same
// machine and type — same-origin tabs sync peer-to-peer via BroadcastChannel,
// so there is NO server to run. (For cross-network collab, pass your own
// `signaling` servers to WebrtcProvider, or swap in y-websocket.)
import { useEffect, useState } from "react";
import {
  createEditorSystem,
  richTextExtension,
  collaborationExtension,
  useCollaborators,
  RichText,
  type CollaborationProvider,
} from "@lexkit/editor";
import "@/app/(docs)/examples/basic-editor.css";

// One identity per tab so presence shows distinct users.
const NAMES = ["Ada", "Linus", "Grace", "Alan", "Margaret", "Dennis"];
const COLORS = ["#e11d48", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0891b2"];
const me = Math.floor(Math.random() * NAMES.length);
const username = NAMES[me];
const cursorColor = COLORS[me];

const extensions = [richTextExtension, collaborationExtension] as const;
const { Provider } = createEditorSystem<typeof extensions>();

// Live presence bar built entirely from the headless awareness API.
function PresenceBar() {
  const { users, isConnected } = useCollaborators();
  return (
    <div className="basic-toolbar" style={{ gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 13, opacity: 0.7 }}>
        {isConnected ? "🟢 live" : "⚪ offline"} · {users.length} here
      </span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {users.map((u) => (
          <span
            key={u.clientId}
            title={u.isLocal ? `${u.name} (you)` : u.name}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: u.isLocal ? 700 : 500,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: u.color || "#888",
                display: "inline-block",
              }}
            />
            {u.name || "anonymous"}
            {u.isLocal ? " (you)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BasicCollaborativeEditor() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Load the transport in the browser only (y-webrtc touches browser APIs).
    Promise.all([import("y-webrtc"), import("yjs")]).then(
      ([{ WebrtcProvider }, Y]) => {
        if (cancelled) return;
        collaborationExtension.configure({
          id: "lexkit-collab-demo",
          username,
          cursorColor,
          providerFactory: (id, docMap) => {
            let doc = docMap.get(id);
            if (!doc) {
              doc = new Y.Doc();
              docMap.set(id, doc);
            }
            // No signaling servers passed → same-origin tabs still sync via
            // BroadcastChannel. Add `{ signaling: ["wss://your-server"] }` for
            // cross-device collaboration.
            const provider = new WebrtcProvider(id, doc);
            return provider as unknown as CollaborationProvider;
          },
        });
        setReady(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="basic-editor">
        <div className="basic-editor-container" style={{ padding: 16 }}>
          Loading collaboration…
        </div>
      </div>
    );
  }

  return (
    <Provider extensions={extensions}>
      <div className="basic-editor">
        <PresenceBar />
        <RichText
          classNames={{
            container: "basic-editor-container",
            contentEditable: "basic-content",
            placeholder: "basic-placeholder",
          }}
          placeholder="Open this page in a second tab and type — you're collaborating in real time."
        />
      </div>
    </Provider>
  );
}
