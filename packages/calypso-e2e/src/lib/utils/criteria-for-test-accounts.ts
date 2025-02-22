import type { FeatureCriteria } from './get-test-account-by-feature';

const defaultCriteria: FeatureCriteria[] = [
	{
		gutenberg: 'edge',
		siteType: 'simple',
		accountName: 'gutenbergSimpleSiteEdgeUser',
	},
	{ gutenberg: 'stable', siteType: 'simple', accountName: 'gutenbergSimpleSiteUser' },
	// The CoBlocks account name takes precedence if CoBlocks edge
	// is present. We have two definitions below to effectivelly
	// ignore gutenberg in this case:
	{
		coblocks: 'edge',
		gutenberg: 'stable',
		siteType: 'simple',
		accountName: 'coBlocksSimpleSiteEdgeUser',
	},
	{
		coblocks: 'edge',
		gutenberg: 'edge',
		siteType: 'simple',
		accountName: 'coBlocksSimpleSiteEdgeUser',
	},
	// CoBlocks on Atomic: https://github.com/Automattic/wp-calypso/pull/73052
	// Like in simple, we have one definition for each gutenberg version, to
	// ignore gutenberg in this case.
	{
		coblocks: 'edge',
		gutenberg: 'stable',
		siteType: 'atomic',
		accountName: 'coBlocksAtomicSiteEdgeUser',
	},
	{
		coblocks: 'edge',
		gutenberg: 'edge',
		siteType: 'atomic',
		accountName: 'coBlocksAtomicSiteEdgeUser',
	},
	{
		coblocks: 'edge',
		gutenberg: 'nightly',
		siteType: 'atomic',
		accountName: 'coBlocksAtomicSiteEdgeUser',
	},
	// End of criteria for CoBlocks on Atomic.
	{
		gutenberg: 'stable',
		siteType: 'simple',
		variant: 'siteEditor',
		accountName: 'siteEditorSimpleSiteUser',
	},
	{
		gutenberg: 'edge',
		siteType: 'simple',
		variant: 'siteEditor',
		accountName: 'siteEditorSimpleSiteEdgeUser',
	},
	{
		gutenberg: 'stable',
		siteType: 'atomic',
		variant: 'siteEditor',
		accountName: 'siteEditorAtomicSiteUser',
	},
	{
		gutenberg: 'edge',
		siteType: 'atomic',
		variant: 'siteEditor',
		accountName: 'siteEditorAtomicSiteEdgeUser',
	},
	{
		gutenberg: 'nightly',
		siteType: 'atomic',
		variant: 'siteEditor',
		accountName: 'siteEditorAtomicSiteEdgeUser',
	},
	{
		gutenberg: 'stable',
		siteType: 'atomic',
		accountName: 'gutenbergAtomicSiteUser',
	},
	{
		gutenberg: 'edge',
		siteType: 'atomic',
		accountName: 'gutenbergAtomicSiteEdgeUser',
	},

	// @todo consider adding a special '*' wildcard value to ignore certain
	// features, for example: `gutenberg: '*', siteType: '*'`.
	{ gutenberg: 'edge', variant: 'i18n', siteType: 'simple', accountName: 'i18nUser' },
	{ gutenberg: 'stable', variant: 'i18n', siteType: 'simple', accountName: 'i18nUser' },
	// we're effectivelly ignoring the atomic siteType here, by pointing to the same
	// simple site even if "atomic"
	{ gutenberg: 'edge', variant: 'i18n', siteType: 'atomic', accountName: 'i18nUser' },
	{ gutenberg: 'stable', variant: 'i18n', siteType: 'atomic', accountName: 'i18nUser' },

	// Jetpack users
	{
		siteType: 'simple',
		jetpackTarget: 'wpcom-staging',
		gutenberg: 'stable',
		accountName: 'jetpackStagingUser',
	},
	{
		siteType: 'simple',
		jetpackTarget: 'wpcom-staging',
		gutenberg: 'stable',
		variant: 'siteEditor',
		accountName: 'jetpackStagingFseUser',
	},
	{
		siteType: 'atomic',
		gutenberg: 'stable',
		jetpackTarget: 'remote-site',
		accountName: 'jetpackRemoteSiteUser',
	},
	// Atomic GB nightly tests
	{
		siteType: 'atomic',
		gutenberg: 'nightly',
		accountName: 'gutenbergAtomicSiteEdgeNightliesUser',
	},

	// They aren't run in atomic.
];

export default defaultCriteria;
