import { publishResultFromState, toPublishResultState } from './publish-result-state';

describe('publish result state', () => {
  it('reads back what was written', () => {
    const state = toPublishResultState({
      added: [],
      failures: [{ storeName: 'eBay US', message: 'Refused' }],
    });
    expect(publishResultFromState(state)).toEqual({
      added: 0,
      failures: [{ storeName: 'eBay US', message: 'Refused' }],
    });
  });

  it('ignores anything else in the history state', () => {
    expect(publishResultFromState(null)).toBeNull();
    expect(publishResultFromState({ publishResult: { added: 1, failures: [{}] } })).toBeNull();
  });
});
