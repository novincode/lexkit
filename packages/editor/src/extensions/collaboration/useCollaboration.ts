import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../../core/createEditorSystem";
import { CollaboratorState } from "./types";

/** Return shape of {@link useCollaborators}. */
export interface UseCollaboratorsResult {
  /** All current collaborators (including the local user). */
  users: CollaboratorState[];
  /** Whether the provider currently reports a connected session. */
  isConnected: boolean;
}

/**
 * Headless presence hook. Reads the live collaborator list from the
 * collaboration extension's awareness store and re-renders on change, so you
 * can build any presence UI (avatar bar, "N online", etc.) with full control.
 *
 * Must be used within the editor `Provider`. If the `collaborationExtension`
 * is not registered it simply returns an empty, disconnected state.
 *
 * @example
 * ```tsx
 * function PresenceBar() {
 *   const { users, isConnected } = useCollaborators();
 *   return (
 *     <div>
 *       {isConnected ? "online" : "offline"} · {users.length}
 *       {users.map((u) => (
 *         <span key={u.clientId} style={{ color: u.color }}>{u.name}</span>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCollaborators(): UseCollaboratorsResult {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useCollaborators must be used within the editor Provider");
  }

  const collab = (
    ctx.commands as {
      collab?: {
        getUsers: () => CollaboratorState[];
        onUsersChange: (
          cb: (users: CollaboratorState[]) => void,
        ) => () => void;
      };
    }
  )?.collab;

  const [users, setUsers] = useState<CollaboratorState[]>(
    () => collab?.getUsers?.() ?? [],
  );

  useEffect(() => {
    if (!collab?.onUsersChange) return;
    return collab.onUsersChange((next) => setUsers(next));
  }, [collab]);

  const isConnected = Boolean(
    (ctx.activeStates as { isCollaborating?: boolean })?.isCollaborating,
  );

  return { users, isConnected };
}
