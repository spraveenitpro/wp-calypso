import cookie from 'cookie';

export const persistSignupDestination = ( url ) => {
	const DAY_IN_SECONDS = 3600 * 24;
	const expirationDate = new Date( new Date().getTime() + DAY_IN_SECONDS * 1000 );
	const options = { path: '/', expires: expirationDate, sameSite: 'strict' };
	document.cookie = cookie.serialize( 'wpcom_signup_complete_destination', url, options );
};

export const retrieveSignupDestination = () => {
	const cookies = cookie.parse( document.cookie );
	return cookies.wpcom_signup_complete_destination;
};

export const clearSignupDestinationCookie = () => {
	// Set expiration to a random time in the past so that the cookie gets removed.
	const expirationDate = new Date( new Date().getTime() - 1000 );
	const options = { path: '/', expires: expirationDate };

	document.cookie = cookie.serialize( 'wpcom_signup_complete_destination', '', options );
};

export const getSignupCompleteSlug = () =>
	sessionStorage?.getItem( 'wpcom_signup_complete_site_slug' );
export const setSignupCompleteSlug = ( value ) =>
	sessionStorage?.setItem( 'wpcom_signup_complete_site_slug', value );
export const wasSignupCheckoutPageUnloaded = () =>
	sessionStorage?.getItem( 'was_signup_checkout_page_unloaded' );
export const setSignupCheckoutPageUnloaded = ( value ) =>
	sessionStorage?.setItem( 'was_signup_checkout_page_unloaded', value );
export const getSignupCompleteFlowName = () =>
	sessionStorage?.getItem( 'wpcom_signup_complete_flow_name' );
export const setSignupCompleteFlowName = ( value ) =>
	sessionStorage?.setItem( 'wpcom_signup_complete_flow_name', value );
export const clearSignupCompleteFlowName = () =>
	sessionStorage?.removeItem( 'wpcom_signup_complete_flow_name' );
export const getSignupCompleteFlowNameAndClear = () => {
	const value = getSignupCompleteFlowName();
	clearSignupCompleteFlowName();
	return value;
};
export const getSignupCompleteStepName = () =>
	sessionStorage?.getItem( 'wpcom_signup_complete_step_name' );
export const setSignupCompleteStepName = ( value ) =>
	sessionStorage?.setItem( 'wpcom_signup_complete_step_name', value );
export const clearSignupCompleteStepName = () =>
	sessionStorage?.removeItem( 'wpcom_signup_complete_step_name' );
export const getSignupCompleteStepNameAndClear = () => {
	const value = getSignupCompleteStepName();
	clearSignupCompleteStepName();
	return value;
};
