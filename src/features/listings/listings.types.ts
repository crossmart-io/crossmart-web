import type { components } from '@/api/schema';

type Schemas = components['schemas'];

export type PricingRule = Schemas['PricingRuleDto'];
export type ResolvedPrice = Schemas['ResolvedPriceDto'];
export type ProductSelectionRule = Schemas['ProductSelectionRuleDto'];
export type ProductSelectionFilter = Schemas['ProductSelectionFilterDto'];
export type SelectionPreview = Schemas['SelectionPreviewDto'];
export type SyncRequestResult = Schemas['SyncRequestResultDto'];
export type ChannelListing = Schemas['ChannelListingDto'];
export type ProductChannel = Schemas['ProductChannelDto'];
export type ChannelVariant = Schemas['ChannelVariantDto'];
export type ListingOverride = Schemas['ListingOverrideDto'];
export type ChannelCategory = Schemas['ChannelCategoryDto'];
export type ListingOverrideView = Schemas['ListingOverrideViewDto'];
export type ChannelProduct = components['schemas']['ChannelProductDto'];
export type ChannelProductCounts = components['schemas']['ChannelProductCountsDto'];
export type ChannelProductPage = components['schemas']['ChannelProductPageDto'];
export type ProductStore = components['schemas']['ProductStoreBadgeDto'];
export type CategoryAspect = Schemas['CategoryAspectDto'];
export type ItemSpecific = Schemas['ItemSpecificDto'];
export type ListingItemSpecifics = Schemas['ListingItemSpecificsDto'];
