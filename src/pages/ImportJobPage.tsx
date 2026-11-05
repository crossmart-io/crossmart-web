import { useParams } from 'react-router';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { type ResourcePageCopy, ResourcePage } from '@/components/layout/ResourcePage';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import {
  describeActor,
  IMPORT_FORMAT_LABELS,
  IMPORT_MODE_COPY,
  ImportJobDetails,
  ImportJobStatusBadge,
  useImportJob,
} from '@/features/imports';
import { formatDateTime } from '@/lib/format';

const IMPORT_PAGE_COPY: ResourcePageCopy = {
  name: 'Import',
  notFoundName: 'Import not found',
  notFound: 'This import does not exist in this workspace.',
  loadFailed: 'This import could not be loaded',
};

function ImportJob({ workspaceId, jobId }: { workspaceId: string; jobId: string }) {
  const query = useImportJob(workspaceId, jobId);
  return (
    <ResourcePage query={query} copy={IMPORT_PAGE_COPY} parents={PAGE_PARENTS.imports}>
      {(job) => (
        <Page
          name={job.fileName}
          parents={PAGE_PARENTS.imports}
          title={
            <>
              <span className="min-w-0 break-all">{job.fileName}</span>
              <ImportJobStatusBadge status={job.status} />
            </>
          }
          description={`${IMPORT_FORMAT_LABELS[job.format]} · ${IMPORT_MODE_COPY[job.mode].label} · ${formatDateTime(job.createdAt)} · ${describeActor(job.actor)}`}
        >
          <ImportJobDetails job={job} />
        </Page>
      )}
    </ResourcePage>
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
