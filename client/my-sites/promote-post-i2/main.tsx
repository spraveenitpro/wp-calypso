import config from '@automattic/calypso-config';
import './style.scss';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@wordpress/components';
import classNames from 'classnames';
import { useTranslate } from 'i18n-calypso';
import { useMemo, useState } from 'react';
import DocumentHead from 'calypso/components/data/document-head';
import EmptyContent from 'calypso/components/empty-content';
import FormattedHeader from 'calypso/components/formatted-header';
import InlineSupportLink from 'calypso/components/inline-support-link';
import { BlazablePost, Campaign } from 'calypso/data/promote-post/types';
import useCampaignsQueryPaged from 'calypso/data/promote-post/use-promote-post-campaigns-query-paged';
import useCampaignsStatsQuery from 'calypso/data/promote-post/use-promote-post-campaigns-stats-query';
import useCreditBalanceQuery from 'calypso/data/promote-post/use-promote-post-credit-balance-query';
import usePostsQueryPaged, {
	getSearchOptionsQueryParams,
} from 'calypso/data/promote-post/use-promote-post-posts-query-paged';
import { addHotJarScript } from 'calypso/lib/analytics/hotjar';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import CampaignsList from 'calypso/my-sites/promote-post-i2/components/campaigns-list';
import PostsList from 'calypso/my-sites/promote-post-i2/components/posts-list';
import PromotePostTabBar from 'calypso/my-sites/promote-post-i2/components/promoted-post-filter';
import {
	SORT_OPTIONS_DEFAULT,
	SearchOptions,
} from 'calypso/my-sites/promote-post-i2/components/search-bar';
import { getPagedBlazeSearchData, unifyCampaigns } from 'calypso/my-sites/promote-post-i2/utils';
import { useSelector } from 'calypso/state';
import { getSelectedSite } from 'calypso/state/ui/selectors';
import CreditBalance from './components/credit-balance';
import MainWrapper from './components/main-wrapper';
import PostsListBanner from './components/posts-list-banner';
import useOpenPromoteWidget from './hooks/use-open-promote-widget';
import { getAdvertisingDashboardPath } from './utils';

export type TabType = 'posts' | 'campaigns' | 'credits';
export type TabOption = {
	id: TabType;
	name: string;
	itemCount?: number;
	isCountAmount?: boolean;
	className?: string;
	enabled?: boolean;
};

interface Props {
	tab?: TabType;
}

export type DSPMessage = {
	errorCode?: string;
};

export type PagedBlazeContentData = {
	has_more_pages: boolean;
	total_items?: number;
	items?: Campaign[] | BlazablePost[];
};

export type PagedBlazeSearchResponse = {
	pages: PagedBlazeContentData[];
};

const POST_DEFAULT_SEARCH_OPTIONS: SearchOptions = {
	order: SORT_OPTIONS_DEFAULT,
};

export default function PromotedPosts( { tab }: Props ) {
	const isRunningInJetpack = config.isEnabled( 'is_running_in_jetpack_site' );
	const selectedTab = tab && [ 'campaigns', 'posts', 'credits' ].includes( tab ) ? tab : 'posts';
	const selectedSite = useSelector( getSelectedSite );
	const selectedSiteId = selectedSite?.ID || 0;
	const translate = useTranslate();
	const onClickPromote = useOpenPromoteWidget( {
		keyValue: 'post-0', // post 0 means to open post selector in widget
		entrypoint: 'promoted_posts-header',
	} );

	const { data: creditBalance = '0.00' } = useCreditBalanceQuery();

	/* query for campaigns */
	const [ campaignsSearchOptions, setCampaignsSearchOptions ] = useState< SearchOptions >( {} );
	const campaignsQuery = useCampaignsQueryPaged( selectedSiteId ?? 0, campaignsSearchOptions );
	const {
		fetchNextPage: fetchCampaignsNextPage,
		data: campaignsData,
		isLoading: campaignsIsLoading,
		isFetchingNextPage: campaignIsFetching,
		error: campaignError,
		isRefetching: campaignIsRefetching,
	} = campaignsQuery;

	const campaignIsLoadingNewContent = campaignsIsLoading || campaignIsRefetching;

	const queryClient = useQueryClient();
	const initialCampaignQueryState = queryClient.getQueryState( [
		'promote-post-campaigns',
		selectedSiteId,
		'',
	] );

	const { has_more_pages: campaignsHasMorePages, items: pagedCampaigns } = getPagedBlazeSearchData(
		'campaigns',
		campaignsData
	);

	const { data: campaignsStatsData } = useCampaignsStatsQuery( selectedSiteId ?? 0 );
	const campaigns = useMemo(
		() => unifyCampaigns( pagedCampaigns as Campaign[], campaignsStatsData ),
		[ pagedCampaigns, campaignsStatsData ]
	);

	const { total_items: totalCampaignsUnfiltered } = getPagedBlazeSearchData(
		'campaigns',
		initialCampaignQueryState?.data as PagedBlazeSearchResponse
	);

	/* query for posts */
	const [ postsSearchOptions, setPostsSearchOptions ] = useState< SearchOptions >(
		POST_DEFAULT_SEARCH_OPTIONS
	);
	const postsQuery = usePostsQueryPaged( selectedSiteId ?? 0, postsSearchOptions );

	const {
		fetchNextPage: fetchPostsNextPage,
		data: postsData,
		isLoading: postsIsLoading,
		isFetchingNextPage: postIsFetching,
		error: postError,
		isRefetching: postIsRefetching,
	} = postsQuery;

	const postsIsLoadingNewContent = postsIsLoading || postIsRefetching;

	const initialPostQueryState = queryClient.getQueryState( [
		'promote-post-posts',
		selectedSiteId,
		getSearchOptionsQueryParams( POST_DEFAULT_SEARCH_OPTIONS ),
	] );

	const { has_more_pages: postsHasMorePages, items: posts } = getPagedBlazeSearchData(
		'posts',
		postsData
	);
	const { total_items: totalPostsUnfiltered } = getPagedBlazeSearchData(
		'posts',
		initialPostQueryState?.data as PagedBlazeSearchResponse
	);

	const tabs: TabOption[] = [
		{
			id: 'posts',
			name: translate( 'Ready to promote' ),
			itemCount: totalPostsUnfiltered,
		},
		{
			id: 'campaigns',
			name: translate( 'Campaigns' ),
			itemCount: totalCampaignsUnfiltered,
		},
		{
			id: 'credits',
			name: translate( 'Credits' ),
			className: 'pull-right',
			itemCount: parseFloat( creditBalance ),
			isCountAmount: true,
			enabled: parseFloat( creditBalance ) > 0,
		},
	];

	if ( selectedSite?.is_coming_soon || selectedSite?.is_private ) {
		return (
			<EmptyContent
				className="campaigns-empty"
				title={
					selectedSite?.is_coming_soon
						? translate( 'Site is not published' )
						: translate( 'Site is private' )
				}
				line={ translate(
					'To start using Blaze, you must make your site public. You can do that from {{sitePrivacySettingsLink}}here{{/sitePrivacySettingsLink}}.',
					{
						components: {
							sitePrivacySettingsLink: (
								<a
									href={ `https://wordpress.com/settings/general/${ selectedSite.domain }#site-privacy-settings` }
									rel="noreferrer"
								/>
							),
						},
					}
				) }
				illustration={ null }
			/>
		);
	}

	const showBanner = ! campaignsIsLoading && ( totalCampaignsUnfiltered || 0 ) < 3;

	// Add Hotjar script to the page.
	addHotJarScript();

	const headerSubtitle = ( isMobile: boolean ) => {
		if ( ! isMobile && showBanner ) {
			// Do not show subtitle for desktops where banner should be shown
			return null;
		}

		const baseClassName = 'promote-post-i2__header-subtitle';
		return (
			<div
				className={ classNames(
					baseClassName,
					`${ baseClassName }_${ isMobile ? 'mobile' : 'desktop' }`
				) }
			>
				{ translate(
					'Use Blaze to grow your audience by promoting your content across Tumblr and WordPress.com.'
				) }
			</div>
		);
	};

	return (
		<MainWrapper>
			<DocumentHead title={ translate( 'Advertising' ) } />

			<div className="promote-post-i2__top-bar">
				<FormattedHeader
					brandFont
					className={ classNames( 'advertising__page-header', {
						'advertising__page-header_has-banner': showBanner,
					} ) }
					children={ headerSubtitle( false ) /* for desktop */ }
					headerText={ translate( 'Advertising' ) }
					align="left"
				/>

				<div className="promote-post-i2__top-bar-buttons">
					<InlineSupportLink
						supportContext="advertising"
						className="button posts-list-banner__learn-more"
						showIcon={ false }
						showSupportModal={ ! isRunningInJetpack }
					/>
					<Button isPrimary onClick={ onClickPromote }>
						{ translate( 'Promote' ) }
					</Button>
				</div>
			</div>
			{ headerSubtitle( true ) /* for mobile */ }

			{ showBanner && <PostsListBanner /> }

			<PromotePostTabBar tabs={ tabs } selectedTab={ selectedTab } />

			{ /* Render campaigns tab */ }
			{ selectedTab === 'campaigns' && (
				<>
					<PageViewTracker
						path={ getAdvertisingDashboardPath( '/:site/campaigns' ) }
						title="Advertising > Campaigns"
					/>
					<CampaignsList
						isLoading={ campaignIsLoadingNewContent }
						isFetching={ campaignIsFetching }
						isError={ campaignError as DSPMessage }
						fetchNextPage={ fetchCampaignsNextPage }
						handleSearchOptions={ setCampaignsSearchOptions }
						totalCampaigns={ totalCampaignsUnfiltered || 0 }
						hasMorePages={ campaignsHasMorePages }
						campaigns={ campaigns as Campaign[] }
					/>
				</>
			) }

			{ /* Render credits tab */ }
			{ selectedTab === 'credits' && (
				<>
					<PageViewTracker
						path={ getAdvertisingDashboardPath( '/:site/credits' ) }
						title="Advertising > Credits"
					/>
					<CreditBalance balance={ creditBalance } />
				</>
			) }

			{ /* Render posts tab */ }
			{ selectedTab !== 'campaigns' && selectedTab !== 'credits' && (
				<>
					<PageViewTracker
						path={ getAdvertisingDashboardPath( '/:site/posts' ) }
						title="Advertising > Ready to Promote"
					/>
					<PostsList
						isLoading={ postsIsLoadingNewContent }
						isFetching={ postIsFetching }
						isError={ postError as DSPMessage }
						fetchNextPage={ fetchPostsNextPage }
						handleSearchOptions={ setPostsSearchOptions }
						totalCampaigns={ totalPostsUnfiltered || 0 }
						hasMorePages={ postsHasMorePages }
						posts={ posts as BlazablePost[] }
					/>
				</>
			) }
		</MainWrapper>
	);
}
