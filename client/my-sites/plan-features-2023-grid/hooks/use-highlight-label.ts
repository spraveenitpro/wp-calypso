import {
	isBusinessPlan,
	isPremiumPlan,
	isPersonalPlan,
	planLevelsMatch,
} from '@automattic/calypso-products';
import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'calypso/state';
import isPlanAvailableForPurchase from 'calypso/state/sites/plans/selectors/is-plan-available-for-purchase';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import { usePlansGridContext } from '../grid-context';
import { isPopularPlan } from '../lib/is-popular-plan';

interface Props {
	planName: string;
	currentSitePlanSlug?: string | null;
	selectedPlan?: string;
}

const useHighlightLabel = ( { planName, currentSitePlanSlug, selectedPlan }: Props ) => {
	const translate = useTranslate();
	const isCurrentPlan = currentSitePlanSlug === planName;
	const selectedSiteId = useSelector( getSelectedSiteId );
	const isAvailableForPurchase = useSelector(
		( state ) => !! selectedSiteId && isPlanAvailableForPurchase( state, selectedSiteId, planName )
	);
	const isSuggestedPlan =
		selectedPlan && planLevelsMatch( planName, selectedPlan ) && isAvailableForPurchase;
	const { intent } = usePlansGridContext();

	if ( isCurrentPlan ) {
		return translate( 'Your plan' );
	} else if ( isSuggestedPlan ) {
		return translate( 'Suggested' );
	} else if ( 'plans-newsletter' === intent ) {
		if ( isPersonalPlan( planName ) ) {
			return translate( 'Best for Newsletter' );
		}
	} else if ( 'plans-link-in-bio' === intent ) {
		if ( isPremiumPlan( planName ) ) {
			return translate( 'Best for Link in Bio' );
		}
	} else if ( 'plans-blog-onboarding' === intent ) {
		if ( isPremiumPlan( planName ) ) {
			return translate( 'Best for Blog' );
		}
	} else if ( isBusinessPlan( planName ) && ! selectedPlan ) {
		return translate( 'Best for devs' );
	} else if ( isPopularPlan( planName ) && ! selectedPlan ) {
		return translate( 'Popular' );
	}

	return null;
};

export default useHighlightLabel;
