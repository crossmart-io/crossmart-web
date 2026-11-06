import { ListingDisplayState, PublishRequirement } from '@/api/schema';
import { PUBLISH_REQUIREMENT_FIXES } from '@/features/channels/publish-requirements';
import {
  ChannelItemAction,
  type ChannelItemActionInput,
  channelItemAction,
} from './channel-item-action';

const IN_STORE: ChannelItemActionInput = {
  canEdit: true,
  selected: true,
  displayState: ListingDisplayState.published,
  fix: null,
  canRetry: true,
};

describe('channelItemAction', () => {
  it('offers nothing to members who may not change listings', () => {
    expect(channelItemAction({ ...IN_STORE, canEdit: false })).toBe(ChannelItemAction.None);
  });

  it('adds a product the store does not have', () => {
    expect(channelItemAction({ ...IN_STORE, selected: false })).toBe(ChannelItemAction.Add);
  });

  it('fixes what holds the listing back before anything else', () => {
    expect(
      channelItemAction({
        ...IN_STORE,
        displayState: ListingDisplayState.failed,
        fix: PUBLISH_REQUIREMENT_FIXES[PublishRequirement.category],
      }),
    ).toBe(ChannelItemAction.Fix);
  });

  it('tries a failure with nothing to fix again, unless the store needs reconnecting', () => {
    const failed = { ...IN_STORE, displayState: ListingDisplayState.failed };

    expect(channelItemAction(failed)).toBe(ChannelItemAction.Retry);
    expect(channelItemAction({ ...failed, canRetry: false })).toBe(ChannelItemAction.Edit);
  });

  it('edits a listing that is fine', () => {
    expect(channelItemAction(IN_STORE)).toBe(ChannelItemAction.Edit);
  });
});
