import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isEnumValue } from '@/lib/enum';
import { ASK_INSIGHTS_COPY, ASK_INSIGHTS_VIEW_LABELS } from '../ask-insights.constants';
import { AskInsightsView } from '../ask-insights.types';
import { useAskInsightsView } from '../hooks/useAskInsightsView';
import { useTopAskQuestions, useUnansweredAskQuestions } from '../hooks/useAskQuestionCounts';
import { ConversationList } from './ConversationList';
import { EscalationList } from './EscalationList';
import { QuestionCountsSection } from './QuestionCountsSection';

const VIEWS = Object.values(AskInsightsView);

/** The page's sections as tabs; the open one is in the URL, so each can be linked to. */
export function AskInsights() {
  const [view, setView] = useAskInsightsView();
  return (
    <Tabs
      value={view}
      onValueChange={(next) => isEnumValue(AskInsightsView, next) && setView(next)}
      className="gap-4"
    >
      <TabsList aria-label={ASK_INSIGHTS_COPY.viewsLabel} className="max-w-full overflow-x-auto">
        {VIEWS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {ASK_INSIGHTS_VIEW_LABELS[tab]}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={AskInsightsView.Conversations}>
        <ConversationList />
      </TabsContent>
      <TabsContent value={AskInsightsView.TopQuestions}>
        <QuestionCountsSection
          description={ASK_INSIGHTS_COPY.topDescription}
          useQuestions={useTopAskQuestions}
        />
      </TabsContent>
      <TabsContent value={AskInsightsView.Unanswered}>
        <QuestionCountsSection
          description={ASK_INSIGHTS_COPY.unansweredDescription}
          useQuestions={useUnansweredAskQuestions}
        />
      </TabsContent>
      <TabsContent value={AskInsightsView.Escalations}>
        <EscalationList />
      </TabsContent>
    </Tabs>
  );
}
