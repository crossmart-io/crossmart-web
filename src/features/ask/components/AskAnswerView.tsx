import type { AskAnswer } from '../ask.types';
import type { AskEscalation } from '../hooks/useAskEscalation';
import { AskCitations } from './AskCitations';
import { AskContactPerson } from './AskContactPerson';
import { AskHandoff } from './AskHandoff';

interface AskAnswerViewProps {
  answer: AskAnswer;
  /** Given for the latest answer only, which can hand the conversation to a person. */
  escalation?: AskEscalation;
}

/** The way to a person: the team itself when Ask offers it, else the support address. */
function AskPersonAction({ answer, escalation }: AskAnswerViewProps) {
  if (answer.escalation.offered) {
    return escalation ? <AskContactPerson escalation={escalation} /> : null;
  }
  return answer.handoff ? <AskHandoff supportEmail={answer.supportEmail} /> : null;
}

/** The answer in the question's language, its sources, and a person to reach if needed. */
export function AskAnswerView({ answer, escalation }: AskAnswerViewProps) {
  return (
    <div className="flex flex-col gap-3">
      <p dir="auto" className="leading-relaxed break-words whitespace-pre-line">
        {answer.answer}
      </p>
      <AskCitations citations={answer.citations} />
      <AskPersonAction answer={answer} escalation={escalation} />
    </div>
  );
}
