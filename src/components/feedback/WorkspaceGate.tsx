import type { ReactNode } from 'react';
import { type Workspace, useCurrentWorkspace } from '@/features/workspaces';
import { PageLoader } from './PageLoader';

/** Renders once the current workspace is known, so pages never handle a missing one. */
export function WorkspaceGate({ children }: { children: (workspace: Workspace) => ReactNode }) {
  const { workspace, isError } = useCurrentWorkspace();
  if (isError) {
    return <p className="text-muted-foreground">Your workspace could not be loaded. Try again.</p>;
  }
  if (!workspace) return <PageLoader />;
  return children(workspace);
}
