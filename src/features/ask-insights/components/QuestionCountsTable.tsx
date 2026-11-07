import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/format';
import type { AskQuestionCount } from '../ask-insights.types';

/** Questions asked alike, with how often and when last. */
export function QuestionCountsTable({ questions }: { questions: readonly AskQuestionCount[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead className="w-20 text-right">Asked</TableHead>
            <TableHead className="hidden w-44 sm:table-cell">Last asked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.question}>
              <TableCell dir="auto" className="max-w-0 whitespace-normal break-words">
                {question.question}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {question.count.toLocaleString()}
              </TableCell>
              <TableCell className="hidden text-muted-foreground tabular-nums sm:table-cell">
                {formatDateTime(question.lastAskedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
