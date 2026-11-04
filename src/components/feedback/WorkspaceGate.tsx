import type { ReactNode } from 'react';
import { type Workspace, useCurrentWorkspace } from '@/features/workspaces';
import { ContentLoader } from './ContentLoader';
import { ErrorState } from './ErrorState';

/** Renders once the current workspace is known, so pages never handle a missing one. */
export function WorkspaceGate({ children }: { children: (workspace: Workspace) => ReactNode }) {
  const { workspace, isError, error, refetch } = useCurrentWorkspace();
  if (isError) {
    return (
      <ErrorState title="Your workspace could not be loaded" error={error} onRetry={refetch} />
    );
  }
  if (!workspace) return <ContentLoader />;
  return children(workspace);
}
