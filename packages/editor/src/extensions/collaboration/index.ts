/**
 * Collaboration (Yjs) extension for LexKit.
 *
 * Headless, transport-agnostic real-time collaboration built on Lexical's own
 * `CollaborationPlugin` + `@lexical/yjs`. Plug in any Yjs provider via
 * `providerFactory` (y-websocket, y-webrtc, y-indexeddb, Hocuspocus, …).
 *
 * @packageDocumentation
 */

export {
  CollaborationExtension,
  collaborationExtension,
} from "./CollaborationExtension";
export { useCollaborators } from "./useCollaboration";
export type { UseCollaboratorsResult } from "./useCollaboration";
export type {
  CollaborationConfig,
  CollaborationProviderFactory,
  CollaborationCommands,
  CollaborationStateQueries,
  CollaboratorState,
  LocalUserPatch,
  Provider,
  ExcludedProperties,
} from "./types";
