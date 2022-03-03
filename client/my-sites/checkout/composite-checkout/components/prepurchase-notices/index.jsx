import {
	getProductFromSlug,
	isJetpackAntiSpam,
	isJetpackAntiSpamSlug,
	isJetpackBackup,
	isJetpackBackupSlug,
	isJetpackPlanSlug,
} from '@automattic/calypso-products';
import { useShoppingCart } from '@automattic/shopping-cart';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Notice from 'calypso/components/notice';
import useCartKey from 'calypso/my-sites/checkout/use-cart-key';
import { requestRewindCapabilities } from 'calypso/state/rewind/capabilities/actions';
import {
	isPlanIncludingSiteBackup,
	isBackupProductIncludedInSitePlan,
	isPlanIncludingSiteAntiSpam,
	isAntiSpamProductIncludedInSitePlan,
} from 'calypso/state/sites/products/conflicts';
import {
	getSitePlan,
	getSiteProducts,
	isJetpackMinimumVersion,
	getSiteOption,
} from 'calypso/state/sites/selectors';
import getSelectedSite from 'calypso/state/ui/selectors/get-selected-site';
import CartPlanOverlapsOwnedProductNotice from './cart-plan-overlaps-owned-product-notice';
import JetpackPluginRequiredVersionNotice from './jetpack-plugin-required-version-notice';
import SitePlanIncludesCartProductNotice from './site-plan-includes-cart-product-notice';

import './style.scss';

/**
 * Renders the most appropriate pre-purchase notice (if applicable)
 * from a range of possible options.
 */
const PrePurchaseNotices = () => {
	const dispatch = useDispatch();

	const selectedSite = useSelector( getSelectedSite );
	const siteId = selectedSite?.ID;

	const cartKey = useCartKey();
	const { responseCart } = useShoppingCart( cartKey );
	const cartItemSlugs = responseCart.products.map( ( item ) => item.product_slug );

	useEffect( () => {
		if ( ! siteId ) return;
		dispatch( requestRewindCapabilities( siteId ) );
	}, [ dispatch, siteId ] );

	const currentSitePlan = useSelector( ( state ) => {
		if ( ! siteId ) {
			return null;
		}

		return getSitePlan( state, siteId );
	} );
	const currentSiteProducts = useSelector( ( state ) => {
		if ( ! siteId ) {
			return null;
		}

		const products = getSiteProducts( state, siteId ) || [];
		return products.filter( ( p ) => ! p.expired );
	} );

	const backupSlugInCart = cartItemSlugs.find( isJetpackBackupSlug );
	const antiSpamSlugInCart = cartItemSlugs.find( isJetpackAntiSpamSlug );

	const cartPlanOverlapsSiteBackupPurchase = useSelector( ( state ) => {
		const planSlugInCart = cartItemSlugs.find( isJetpackPlanSlug );

		return planSlugInCart && isPlanIncludingSiteBackup( state, siteId, planSlugInCart );
	} );

	const cartPlanOverlapsSiteAntiSpamPurchase = useSelector( ( state ) => {
		const planSlugInCart = cartItemSlugs.find( isJetpackPlanSlug );

		return planSlugInCart && isPlanIncludingSiteAntiSpam( state, siteId, planSlugInCart );
	} );

	const sitePlanIncludesCartBackupProduct = useSelector(
		( state ) =>
			backupSlugInCart && isBackupProductIncludedInSitePlan( state, siteId, backupSlugInCart )
	);

	const sitePlanIncludesCartAntiSpamProduct = useSelector(
		( state ) =>
			antiSpamSlugInCart && isAntiSpamProductIncludedInSitePlan( state, siteId, antiSpamSlugInCart )
	);

	const BACKUP_MINIMUM_JETPACK_VERSION = '8.5';
	const siteHasBackupMinimumPluginVersion = useSelector( ( state ) => {
		const activeConnectedPlugins = getSiteOption(
			state,
			siteId,
			'jetpack_connection_active_plugins'
		);
		const backupPluginActive =
			Array.isArray( activeConnectedPlugins ) &&
			activeConnectedPlugins.includes( 'jetpack-backup' );
		return (
			backupPluginActive || isJetpackMinimumVersion( state, siteId, BACKUP_MINIMUM_JETPACK_VERSION )
		);
	} );

	// All these notices (and the selectors that drive them)
	// require a site ID to work. We should *conceptually* always
	// have a site ID handy; consider this a guard, or an
	// explicit declaration that all code beyond this point can
	// safely assume a site ID has been defined.
	if ( ! siteId ) {
		return null;
	}

	// This site has an active Jetpack Backup product purchase,
	// but we're attempting to buy a plan that includes one as well
	const siteBackupProduct = currentSiteProducts.find( isJetpackBackup );
	if ( cartPlanOverlapsSiteBackupPurchase && siteBackupProduct ) {
		return (
			<CartPlanOverlapsOwnedProductNotice
				product={ siteBackupProduct }
				selectedSite={ selectedSite }
			/>
		);
	}

	const siteAntiSpamProduct = currentSiteProducts.find( isJetpackAntiSpam );
	if ( cartPlanOverlapsSiteAntiSpamPurchase && siteAntiSpamProduct ) {
		return (
			<CartPlanOverlapsOwnedProductNotice
				product={ siteAntiSpamProduct }
				selectedSite={ selectedSite }
			/>
		);
	}

	const backupProductInCart = backupSlugInCart && getProductFromSlug( backupSlugInCart );

	// We're attempting to buy Jetpack Backup individually,
	// but this site already has a plan that includes it
	if ( sitePlanIncludesCartBackupProduct && currentSitePlan ) {
		return (
			<SitePlanIncludesCartProductNotice
				plan={ currentSitePlan }
				product={ backupProductInCart }
				selectedSite={ selectedSite }
			/>
		);
	}

	const antiSpamProductInCart = antiSpamSlugInCart && getProductFromSlug( antiSpamSlugInCart );

	if ( sitePlanIncludesCartAntiSpamProduct && currentSitePlan ) {
		return (
			<SitePlanIncludesCartProductNotice
				plan={ currentSitePlan }
				product={ antiSpamProductInCart }
				selectedSite={ selectedSite }
			/>
		);
	}

	if ( ! siteHasBackupMinimumPluginVersion ) {
		return (
			<JetpackPluginRequiredVersionNotice
				product={ backupProductInCart }
				minVersion={ BACKUP_MINIMUM_JETPACK_VERSION }
			/>
		);
	}

	return null;
};

const Wrapper = ( props ) => {
	const notice = PrePurchaseNotices( props );

	return (
		notice && (
			<div className="prepurchase-notices__container">
				<Notice status="is-info" showDismiss={ false }>
					{ notice }
				</Notice>
			</div>
		)
	);
};

export default Wrapper;
