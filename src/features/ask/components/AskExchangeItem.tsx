import { Spinner } from '@/components/ui/spinner';
import { ASK_COPY } from '../ask.constants';
import { type AskExchange, AskExchangeStatus } from '../ask.types';
import { AskAnswerView } from './AskAnswerView';
import { AskFailureNotice } from './AskFailureNotice';

interface AskExchangeItemProps {
  exchange: AskExchange;
}

function AskReply({ exchange }: AskExchangeItemProps) {
  switch (exchange.status) {
    case AskExchangeStatus.Pending:
      return (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Spinner aria-hidden />
          {ASK_COPY.thinking}
        </p>
      );
    case AskExchangeStatus.Answered:
      return <AskAnswerView answer={exchange.answer} />;
    case AskExchangeStatus.Failed:
      return <AskFailureNotice failure={exchange.failure} message={exchange.message} />;
  }
}

/** One question, on the reading end of the panel, and its reply beneath it. */
export function AskExchangeItem({ exchange }: AskExchangeItemProps) {
  return (
    <li className="flex flex-col gap-3">
      <div className="ms-auto max-w-[85%] rounded-lg bg-muted px-3 py-2">
        <span className="sr-only">{ASK_COPY.you}: </span>
        <p dir="auto" className="break-words whitespace-pre-line">
          {exchange.question}
        </p>
      </div>
      <div>
        <span className="sr-only">{ASK_COPY.assistant}: </span>
        <AskReply exchange={exchange} />
      </div>
    </li>
  );
}
