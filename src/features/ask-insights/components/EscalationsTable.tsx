import { Link } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toAskConversationRoute } from '@/config/routes';
import { formatDateTime } from '@/lib/format';
import { ASK_ESCALATION_REASON_LABELS } from '../ask-insights.constants';
import type { AskEscalationRecord } from '../ask-insights.types';
import { contactOf } from '../escalations';
import { EscalationStatusBadge } from './EscalationStatusBadge';

/** Escalations with who to answer and why; each row opens its conversation to reply there. */
export function EscalationsTable({ escalations }: { escalations: readonly AskEscalationRecord[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="hidden w-44 md:table-cell">Reason</TableHead>
            <TableHead className="hidden w-44 sm:table-cell">Opened</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {escalations.map((escalation) => (
            <TableRow key={escalation.id} className="relative">
              <TableCell className="max-w-0">
                <Link
                  to={toAskConversationRoute(escalation.conversationId)}
                  className="block truncate font-medium after:absolute after:inset-0 hover:underline focus-visible:underline"
                >
                  {contactOf(escalation)}
                </Link>
              </TableCell>
              <TableCell>
                <EscalationStatusBadge status={escalation.status} />
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {ASK_ESCALATION_REASON_LABELS[escalation.reason]}
              </TableCell>
              <TableCell className="hidden text-muted-foreground tabular-nums sm:table-cell">
                {formatDateTime(escalation.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
