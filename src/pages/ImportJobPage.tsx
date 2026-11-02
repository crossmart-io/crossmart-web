import { useParams } from 'react-router';
import { isNotFoundError } from '@/api/api-error';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import {
  describeActor,
  IMPORT_MODE_COPY,
  ImportJobDetails,
  ImportJobStatusBadge,
  useImportJob,
} from '@/features/imports';
import { formatDateTime } from '@/lib/format';

const IMPORT_PAGE_NAME = 'Import';

function ImportJob({ workspaceId, jobId }: { workspaceId: string; jobId: string }) {
  const { data: job, isPending, error, refetch } = useImportJob(workspaceId, jobId);

  if (isNotFoundError(error)) {
    return (
      <Page name="Import not found" parents={PAGE_PARENTS.imports}>
        <p className="text-muted-foreground">This import does not exist in this workspace.</p>
      </Page>
    );
  }
  if (error) {
    return (
      <Page name={IMPORT_PAGE_NAME} parents={PAGE_PARENTS.imports}>
        <ErrorState title="This import could not be loaded" error={error} onRetry={refetch} />
      </Page>
    );
  }
  if (isPending) return <ContentLoader />;

  return (
    <Page
      name={job.fileName}
      parents={PAGE_PARENTS.imports}
      title={
        <>
          <span className="min-w-0 break-all">{job.fileName}</span>
          <ImportJobStatusBadge status={job.status} />
        </>
      }
      description={`${IMPORT_MODE_COPY[job.mode].label} · ${formatDateTime(job.createdAt)} · ${describeActor(job.actor)}`}
    >
      <ImportJobDetails job={job} />
    </Page>
  );
}

export function ImportJobPage() {
  const jobId = useParams()[ROUTE_PARAMS.jobId] ?? '';
  return (
    <WorkspaceGate>
      {(workspace) => <ImportJob workspaceId={workspace.id} jobId={jobId} />}
    </WorkspaceGate>
  );
}
