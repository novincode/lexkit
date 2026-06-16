import type { Doc } from "yjs";
import type { Provider, ExcludedProperties } from "@lexical/yjs";
import type { InitialEditorStateType } from "@lexical/react/LexicalComposer";
import type { RefObject } from "react";
import { BaseExtensionConfig } from "../types";

// Re-export the Yjs provider contract so consumers can type their factories
// without reaching into @lexical/yjs directly.
export type { Provider, ExcludedProperties } from "@lexical/yjs";

/**
 * Factory that creates a Yjs {@link Provider} for a given document id.
 *
 * This is the single transport seam: LexKit ships no transport itself, so you
 * plug in y-websocket, y-webrtc, y-indexeddb, Hocuspocus, Liveblocks, etc.
 * Anything that satisfies the `@lexical/yjs` `Provider` interface works.
 *
 * @param id - The document/room id (matches {@link CollaborationConfig.id})
 * @param yjsDocMap - Shared map of id -> Y.Doc managed by Lexical
 */
export type CollaborationProviderFactory = (
  id: string,
  yjsDocMap: Map<string, Doc>,
) => Provider;

/**
 * Configuration for the {@link CollaborationExtension}.
 *
 * The extension stays inert until {@link providerFactory} is supplied, so it is
 * safe to include unconditionally in an extensions array.
 */
export interface CollaborationConfig extends BaseExtensionConfig {
  /** Transport factory. Required to activate collaboration. */
  providerFactory?: CollaborationProviderFactory;
  /** Document/room id. Defaults to `"lexkit-collab"`. */
  id?: string;
  /**
   * Whether this client should seed an empty document when the shared doc is
   * empty. Exactly one client should bootstrap. Defaults to `true`.
   */
  shouldBootstrap?: boolean;
  /** Display name for this user's cursor/presence. */
  username?: string;
  /** Cursor color (any CSS color) for this user. */
  cursorColor?: string;
  /** Arbitrary presence payload (avatar URL, user id, …) shared via awareness. */
  awarenessData?: Record<string, unknown>;
  /** Node properties to exclude from Yjs sync (e.g. transient `__uploading`). */
  excludedProperties?: ExcludedProperties;
  /** Initial editor state used only by the bootstrapping client. */
  initialEditorState?: InitialEditorStateType;
  /**
   * Optional external container for remote cursor carets. When omitted the
   * extension renders its own themeable container (`theme.collab.cursorsContainer`).
   */
  cursorsContainerRef?: RefObject<HTMLElement | null>;
}

/**
 * A single participant in the collaboration session, derived from Yjs awareness.
 */
export interface CollaboratorState {
  /** Yjs awareness client id. */
  clientId: number;
  /** Display name (from `username` / `setLocalUser`). */
  name: string;
  /** Cursor color. */
  color: string;
  /** Arbitrary presence payload supplied via `awarenessData`. */
  awarenessData: Record<string, unknown>;
  /** Whether this client currently has editor focus. */
  focusing: boolean;
  /** Whether this entry is the local user. */
  isLocal: boolean;
}

/** Patch shape accepted by `commands.collab.setLocalUser`. */
export interface LocalUserPatch {
  name?: string;
  color?: string;
  awarenessData?: Record<string, unknown>;
}

/** Commands contributed by the collaboration extension (namespaced under `collab`). */
export interface CollaborationCommands {
  collab: {
    /** Connect the provider (dispatches `TOGGLE_CONNECT_COMMAND`). */
    connect: () => void;
    /** Disconnect the provider. */
    disconnect: () => void;
    /** Toggle the connection based on current state. */
    toggle: () => void;
    /** Update the local user's presence fields. */
    setLocalUser: (user: LocalUserPatch) => void;
    /** Snapshot of all current collaborators (including the local user). */
    getUsers: () => CollaboratorState[];
    /** Subscribe to collaborator changes. Fires immediately. Returns an unsubscribe. */
    onUsersChange: (cb: (users: CollaboratorState[]) => void) => () => void;
  };
}

/**
 * State queries contributed by the collaboration extension.
 *
 * Declared as a `type` (not `interface`) so it satisfies the
 * `Record<string, () => Promise<boolean>>` constraint on `BaseExtension`.
 */
export type CollaborationStateQueries = {
  /** True while the provider reports a connected session. */
  isCollaborating: () => Promise<boolean>;
};
