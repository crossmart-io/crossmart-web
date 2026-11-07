import { api } from '@/api/client';
import {
  ASK_QUESTION_LIST_LIMIT,
  ASK_TOP_QUESTIONS_ENDPOINT,
  ASK_UNANSWERED_QUESTIONS_ENDPOINT,
} from '../ask-insights.constants';
import type { DayRange } from '../ask-insights.types';
import { toInstantRange } from '../day-range';

/** The questions asked most in the period. */
export function useTopAskQuestions(range: DayRange) {
  return api.useQuery('get', ASK_TOP_QUESTIONS_ENDPOINT, {
    params: { query: { ...toInstantRange(range), limit: ASK_QUESTION_LIST_LIMIT } },
  });
}

/** The questions Ask did not answer, or answered unsure, most asked first. */
export function useUnansweredAskQuestions(range: DayRange) {
  return api.useQuery('get', ASK_UNANSWERED_QUESTIONS_ENDPOINT, {
    params: { query: { ...toInstantRange(range), limit: ASK_QUESTION_LIST_LIMIT } },
  });
}
