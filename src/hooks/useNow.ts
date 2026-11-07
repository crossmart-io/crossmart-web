import { useState } from 'react';

/** The time the component first rendered, so a render reads one stable "now". */
export function useNow(): Date {
  const [now] = useState(() => new Date());
  return now;
}
