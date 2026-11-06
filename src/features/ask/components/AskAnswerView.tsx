import type { AskAnswer } from '../ask.types';
import { AskCitations } from './AskCitations';
import { AskHandoff } from './AskHandoff';

interface AskAnswerViewProps {
  answer: AskAnswer;
}

/** The answer in the question's language, its sources, and a person to write to if needed. */
export function AskAnswerView({ answer }: AskAnswerViewProps) {
  return (
    <div className="flex flex-col gap-3">
      <p dir="auto" className="leading-relaxed break-words whitespace-pre-line">
        {answer.answer}
      </p>
      <AskCitations citations={answer.citations} />
      {answer.handoff && <AskHandoff supportEmail={answer.supportEmail} />}
    </div>
  );
}
