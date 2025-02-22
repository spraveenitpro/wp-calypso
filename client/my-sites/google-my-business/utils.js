import { get, merge } from 'lodash';
import getGoogleMyBusinessLocations from 'calypso/state/selectors/get-google-my-business-locations';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';

/**
 * Enhances any Redux action that denotes the recording of an analytics event with two additional properties which
 * specify the number of verified and unverified locations of the Google My Business account currently connected.
 *
 * @param {Object} action - Redux action as a plain object
 * @param {Function} getState - Redux function that can be used to retrieve the current state tree
 * @returns {Object} the new Redux action
 * @see client/state/utils/withEnhancers
 */
export const enhanceWithLocationCounts = ( action, getState ) => {
	const siteId = getSelectedSiteId( getState() );

	if ( siteId !== null ) {
		const locations = getGoogleMyBusinessLocations( getState(), siteId );

		const verifiedLocationCount = locations.filter( ( location ) =>
			get( location, 'meta.state.isVerified', false )
		).length;

		return merge( action, {
			meta: {
				analytics: [
					{
						payload: {
							properties: {
								location_count: locations.length,
								verified_location_count: verifiedLocationCount,
							},
						},
					},
				],
			},
		} );
	}

	return action;
};
