"use client";

import dynamic from "next/dynamic";
import { DynamicCodeExample } from "../../../components/dynamic-code-example";
import { SimpleCodeBlock } from "../../../components/simple-code-block";
import { getHighlightedCode, getRawCode } from "@/lib/generated/code-registry";
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

function Snippet({ id, title }: { id: string; title?: string }) {
  return (
    <SimpleCodeBlock
      title={title}
      html={getHighlightedCode(id) || ""}
      raw={getRawCode(id) || ""}
    />
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
        <DynamicCodeExample
          title="Collaborative editor"
          description="Open in two tabs and type — synced peer-to-peer, no server."
          codes={[
            "docs/extensions/CollaborationExtension/examples/BasicCollaborativeEditor.tsx",
          ]}
          preview={<BasicCollaborativeEditor />}
          tabs={["preview", "Editor"]}
        />
      </section>

      {/* Install */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Install</h2>
        <p className="text-muted-foreground">
          The extension ships with LexKit. You add <code>yjs</code> and a
          transport of your choice — they are optional peer dependencies.
        </p>
        <Snippet id="collaboration-install" />
      </section>

      {/* Quick start */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Quick start</h2>
        <p className="text-muted-foreground">
          The only required option is <code>providerFactory</code> — the single
          seam where you plug in a transport. LexKit never bundles one, and the
          extension stays inert until it&apos;s set.
        </p>
        <Snippet id="collaboration-quick-start" />
      </section>

      {/* Providers */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Choose a transport</h2>
        <p className="text-muted-foreground">
          Anything implementing the Yjs <code>Provider</code> interface works.
        </p>
        <Snippet id="collaboration-y-websocket" title="y-websocket" />
        <Snippet id="collaboration-y-webrtc" title="y-webrtc" />
        <Snippet id="collaboration-y-indexeddb" title="y-indexeddb (offline)" />
      </section>

      {/* Presence */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Presence</h2>
        <p className="text-muted-foreground">
          Build any presence UI with the headless{" "}
          <code>useCollaborators()</code> hook, or drive it imperatively through{" "}
          <code>commands.collab</code>.
        </p>
        <Snippet id="collaboration-presence-hook" title="useCollaborators()" />
        <Snippet id="collaboration-commands" title="commands.collab" />
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
        <Snippet id="collaboration-theme" title="theme.collab" />
      </section>

      {/* Offline */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Offline &amp; reliability</h2>
        <p className="text-muted-foreground">
          Yjs is a CRDT: when a client drops offline and keeps editing, then
          reconnects, all edits merge automatically with no data loss and every
          replica converges to the same state. Add <code>y-indexeddb</code> to
          persist a client&apos;s edits locally so they survive reloads and
          replay on reconnect. This behaviour is identical no matter how content
          is imported (Markdown, HTML or JSON) — collaboration syncs the editor
          state itself.
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
