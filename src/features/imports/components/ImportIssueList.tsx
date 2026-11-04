import type { ImportIssue } from '../imports.types';

/** Problems with single records, each with its spreadsheet row and the record it names. */
export function ImportIssueList({ issues }: { issues: ImportIssue[] }) {
  return (
    <ul className="mt-1 flex max-h-40 flex-col gap-1 overflow-y-auto">
      {issues.map((issue) => (
        <li key={`${issue.row}-${issue.handle}-${issue.sku}-${issue.code}`} className="break-words">
          {issue.row !== undefined && <span className="font-medium">Row {issue.row}: </span>}
          {(issue.handle ?? issue.sku) && (
            <span className="font-mono text-xs">{issue.handle ?? issue.sku} </span>
          )}
          {issue.message}
        </li>
      ))}
    </ul>
  );
}
