import React, { ReactNode, useRef } from "react";
import { LexicalEditor, COMMAND_PRIORITY_LOW } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import {
  CONNECTED_COMMAND,
  TOGGLE_CONNECT_COMMAND,
  type Provider,
} from "@lexical/yjs";
import { BaseExtension } from "../base";
import { ExtensionCategory } from "../types";
import { LexKitTheme } from "../../core/theme";
import {
  CollaborationCommands,
  CollaborationConfig,
  CollaborationProviderFactory,
  CollaborationStateQueries,
  CollaboratorState,
} from "./types";

/**
 * Props for the internal runtime component. Kept separate from the public
 * config so we can pass the (memoized) wrapped factory rather than the raw one.
 */
interface CollaborationRuntimeProps {
  id: string;
  providerFactory: CollaborationProviderFactory;
  shouldBootstrap: boolean;
  username?: string;
  cursorColor?: string;
  awarenessData?: Record<string, unknown>;
  excludedProperties?: CollaborationConfig["excludedProperties"];
  initialEditorState?: CollaborationConfig["initialEditorState"];
  externalCursorsContainerRef?: CollaborationConfig["cursorsContainerRef"];
}

/**
 * Renders Lexical's `CollaborationPlugin` plus a themeable container for remote
 * cursor carets. When the consumer supplies their own `cursorsContainerRef` we
 * defer to it; otherwise we render our own container styled via
 * `theme.collab.cursorsContainer`.
 */
function CollaborationRuntime({
  id,
  providerFactory,
  shouldBootstrap,
  username,
  cursorColor,
  awarenessData,
  excludedProperties,
  initialEditorState,
  externalCursorsContainerRef,
}: CollaborationRuntimeProps) {
  const [editor] = useLexicalComposerContext();
  const internalRef = useRef<HTMLElement | null>(null);
  const usingInternal = !externalCursorsContainerRef;
  const containerRef = externalCursorsContainerRef ?? internalRef;

  const theme = (editor as unknown as { _config?: { theme?: LexKitTheme } })
    ._config?.theme;
  const collabTheme = theme?.collab;

  return (
    <>
      <CollaborationPlugin
        id={id}
        providerFactory={providerFactory}
        shouldBootstrap={shouldBootstrap}
        username={username}
        cursorColor={cursorColor}
        awarenessData={awarenessData}
        excludedProperties={excludedProperties}
        initialEditorState={initialEditorState}
        cursorsContainerRef={
          containerRef as React.MutableRefObject<HTMLElement | null>
        }
      />
      {usingInternal && (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={collabTheme?.cursorsContainer ?? "lexkit-collab-cursors"}
          aria-hidden="true"
        />
      )}
    </>
  );
}

/**
 * CollaborationExtension — headless, real-time collaboration for LexKit.
 *
 * Built on Lexical's own `@lexical/react` `CollaborationPlugin` + `@lexical/yjs`
 * (a CRDT, so offline edits merge conflict-free on reconnect). The transport is
 * fully pluggable via {@link CollaborationConfig.providerFactory} — LexKit ships
 * no transport dependency of its own.
 *
 * Surface (all through the standard extension contract):
 * - `commands.collab.{connect,disconnect,toggle,setLocalUser,getUsers,onUsersChange}`
 * - `activeStates.isCollaborating`
 * - themeable remote cursors via `theme.collab.*`
 * - the `useCollaborators()` hook for presence UI
 *
 * @remarks
 * Collaborative undo/redo is **not** provided by Lexical's `CollaborationPlugin`
 * (it does not expose the binding needed for a Yjs `UndoManager`). When using
 * collaboration, do **not** also register `historyExtension` — Yjs owns history.
 *
 * @example
 * ```tsx
 * import { WebrtcProvider } from "y-webrtc";
 *
 * const extensions = [
 *   richTextExtension,
 *   collaborationExtension.configure({
 *     id: "my-room",
 *     username: "Ada",
 *     cursorColor: "#e11d48",
 *     providerFactory: (id, docMap) =>
 *       new WebrtcProvider(id, docMap.get(id)!) as unknown as Provider,
 *   }),
 * ] as const;
 * ```
 */
export class CollaborationExtension extends BaseExtension<
  "collaboration",
  CollaborationConfig,
  CollaborationCommands,
  CollaborationStateQueries,
  ReactNode[]
> {
  private provider: Provider | null = null;
  private connected = false;
  private localClientId: number | null = null;

  private readonly userListeners = new Set<
    (users: CollaboratorState[]) => void
  >();
  private readonly stateListeners = new Set<() => void>();
  private awarenessHandler: (() => void) | null = null;

  // Stable wrapped-factory cache so re-renders don't recreate the provider.
  private wrappedFactory: CollaborationProviderFactory | null = null;
  private wrappedFor: CollaborationProviderFactory | null = null;

  constructor(config: CollaborationConfig = {}) {
    super("collaboration", [ExtensionCategory.Floating]);
    this.config = {
      showInToolbar: false,
      // Render after the editor children, like RichText, so the plugin mounts
      // inside the composer alongside the content editable.
      position: "after",
      ...config,
    };
  }

  // Collaboration contributes no nodes; it syncs whatever nodes are registered.
  getNodes(): any[] {
    return [];
  }

  // --- Provider lifecycle -------------------------------------------------

  /** Returns a stable wrapped factory that captures the created provider. */
  private getWrappedFactory(
    userFactory: CollaborationProviderFactory,
  ): CollaborationProviderFactory {
    if (this.wrappedFor !== userFactory || !this.wrappedFactory) {
      this.wrappedFor = userFactory;
      this.wrappedFactory = (id, docMap) => {
        const provider = userFactory(id, docMap);
        this.attachProvider(provider);
        return provider;
      };
    }
    return this.wrappedFactory;
  }

  private attachProvider(provider: Provider): void {
    // Detach any previous provider before binding a new one.
    this.detachProvider();
    this.provider = provider;

    const awareness = provider.awareness;
    this.localClientId =
      (awareness as unknown as { clientID?: number }).clientID ?? null;

    // Seed local presence from config.
    const { username, cursorColor, awarenessData } = this.config;
    if (username !== undefined) awareness.setLocalStateField("name", username);
    if (cursorColor !== undefined)
      awareness.setLocalStateField("color", cursorColor);
    if (awarenessData !== undefined)
      awareness.setLocalStateField("awarenessData", awarenessData);

    this.awarenessHandler = () => this.notifyUsers();
    awareness.on("update", this.awarenessHandler);
    this.notifyUsers();
  }

  private detachProvider(): void {
    if (this.provider && this.awarenessHandler) {
      this.provider.awareness.off("update", this.awarenessHandler);
    }
    this.awarenessHandler = null;
    this.provider = null;
    this.localClientId = null;
  }

  // --- Presence -----------------------------------------------------------

  /** Snapshot of all collaborators from Yjs awareness. */
  getUsers(): CollaboratorState[] {
    const awareness = this.provider?.awareness;
    if (!awareness) return [];
    const users: CollaboratorState[] = [];
    awareness.getStates().forEach((state, clientId) => {
      users.push({
        clientId,
        name: typeof state.name === "string" ? state.name : "",
        color: typeof state.color === "string" ? state.color : "",
        awarenessData:
          (state.awarenessData as Record<string, unknown>) ?? {},
        focusing: Boolean(state.focusing),
        isLocal: clientId === this.localClientId,
      });
    });
    return users;
  }

  private notifyUsers(): void {
    const users = this.getUsers();
    this.userListeners.forEach((cb) => cb(users));
  }

  // --- Reactive state plumbing -------------------------------------------

  /**
   * Subscribed by `createEditorSystem` to re-run state queries when the
   * connection status changes (so `activeStates.isCollaborating` stays live).
   */
  onStateChange(cb: () => void): () => void {
    this.stateListeners.add(cb);
    return () => {
      this.stateListeners.delete(cb);
    };
  }

  private notifyStateChange(): void {
    this.stateListeners.forEach((cb) => cb());
  }

  // --- Extension contract -------------------------------------------------

  register(editor: LexicalEditor): () => void {
    // The Yjs binding dispatches CONNECTED_COMMAND, so this is provider-agnostic.
    const unregister = editor.registerCommand<boolean>(
      CONNECTED_COMMAND,
      (payload) => {
        this.connected = payload;
        this.notifyStateChange();
        this.notifyUsers();
        return false; // observe only; don't stop propagation
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      unregister();
      this.detachProvider();
    };
  }

  getCommands(editor: LexicalEditor): CollaborationCommands {
    return {
      collab: {
        connect: () => editor.dispatchCommand(TOGGLE_CONNECT_COMMAND, true),
        disconnect: () =>
          editor.dispatchCommand(TOGGLE_CONNECT_COMMAND, false),
        toggle: () =>
          editor.dispatchCommand(TOGGLE_CONNECT_COMMAND, !this.connected),
        setLocalUser: (user) => {
          const awareness = this.provider?.awareness;
          if (!awareness) return;
          if (user.name !== undefined)
            awareness.setLocalStateField("name", user.name);
          if (user.color !== undefined)
            awareness.setLocalStateField("color", user.color);
          if (user.awarenessData !== undefined)
            awareness.setLocalStateField("awarenessData", user.awarenessData);
        },
        getUsers: () => this.getUsers(),
        onUsersChange: (cb) => {
          this.userListeners.add(cb);
          cb(this.getUsers());
          return () => {
            this.userListeners.delete(cb);
          };
        },
      },
    };
  }

  getStateQueries(_editor: LexicalEditor): CollaborationStateQueries {
    return {
      isCollaborating: async () => this.connected,
    };
  }

  getPlugins(): ReactNode[] {
    const factory = this.config.providerFactory;
    // Inert until configured with a transport — safe to leave in the array.
    if (!factory) return [];

    return [
      <CollaborationRuntime
        key="lexkit-collaboration"
        id={this.config.id ?? "lexkit-collab"}
        providerFactory={this.getWrappedFactory(factory)}
        shouldBootstrap={this.config.shouldBootstrap ?? true}
        username={this.config.username}
        cursorColor={this.config.cursorColor}
        awarenessData={this.config.awarenessData}
        excludedProperties={this.config.excludedProperties}
        initialEditorState={this.config.initialEditorState}
        externalCursorsContainerRef={this.config.cursorsContainerRef}
      />,
    ];
  }
}

/**
 * Pre-configured collaboration extension instance. Activate it with
 * `.configure({ providerFactory })`.
 */
export const collaborationExtension = new CollaborationExtension();
