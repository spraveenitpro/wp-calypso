import { useMutation, useQueryClient } from '@tanstack/react-query';
import wpcom from 'calypso/lib/wp';
import {
	getSubscriberDetailsCacheKey,
	getSubscriberDetailsType,
	getSubscribersCacheKey,
} from '../helpers';
import { useRecordSubscriberRemoved } from '../tracks';
import type { SubscriberEndpointResponse, Subscriber } from '../types';

const useSubscriberRemoveMutation = (
	siteId: number | undefined | null,
	currentPage: number,
	invalidateDetailsCache = false
) => {
	const queryClient = useQueryClient();
	const recordSubscriberRemoved = useRecordSubscriberRemoved();

	return useMutation( {
		mutationFn: async ( subscriber: Subscriber ) => {
			if ( ! siteId || ! subscriber ) {
				throw new Error(
					// reminder: translate this string when we add it to the UI
					'Something went wrong while unsubscribing.'
				);
			}

			if ( subscriber.plans?.length ) {
				// unsubscribe this user from all plans
				const promises = subscriber.plans.map( ( plan ) =>
					wpcom.req.post(
						`/sites/${ siteId }/memberships/subscriptions/${ plan.paid_subscription_id }/cancel`,
						{
							user_id: subscriber.user_id,
						}
					)
				);

				await Promise.all( promises );
			}

			if ( subscriber.user_id ) {
				await wpcom.req.post( `/sites/${ siteId }/followers/${ subscriber.user_id }/delete` );
			} else {
				await wpcom.req.post(
					`/sites/${ siteId }/email-followers/${ subscriber.subscription_id }/delete`
				);
			}

			return true;
		},
		onMutate: async ( subscriber ) => {
			await queryClient.cancelQueries( getSubscribersCacheKey( siteId ) );
			let page = currentPage;

			const previousData = queryClient.getQueryData< SubscriberEndpointResponse >(
				getSubscribersCacheKey( siteId, currentPage )
			);
			const previousPages = [];

			if ( previousData ) {
				// This is some complicated logic to remove the subscriber from the list and shift the next page's first item into this page and so on
				// This is done to avoid a flash of the next page's first item when the query is refetched
				while ( page <= previousData?.pages ) {
					const previousSubscribers = queryClient.getQueryData< SubscriberEndpointResponse >(
						getSubscribersCacheKey( siteId, page )
					);

					if ( previousSubscribers ) {
						// Save previous page data for when query fails and we have to restore
						previousPages[ page ] = previousSubscribers;

						// Alter pagination data
						const total = previousSubscribers.total - 1;
						const pages = Math.ceil( total / previousSubscribers.per_page );

						// Remove subscriber from list
						const subscribers = previousSubscribers.subscribers.filter( ( prevSubscriber ) => {
							return prevSubscriber.subscription_id !== subscriber.subscription_id;
						} );

						// Take the first subscriber of the next page (if we have it cached) and append it to this list.
						// The next page will briefly show this item
						const nextPageQueryData = queryClient.getQueryData< SubscriberEndpointResponse >(
							getSubscribersCacheKey( siteId, page + 1 )
						);
						if ( nextPageQueryData && nextPageQueryData.subscribers.length ) {
							subscribers.push( nextPageQueryData.subscribers[ 0 ] );
						}

						queryClient.setQueryData( getSubscribersCacheKey( siteId, page ), {
							...previousSubscribers,
							subscribers,
							total,
							pages,
						} );
					}

					page++;
				}
			}

			let previousDetailsData;

			if ( invalidateDetailsCache ) {
				const cacheKey = getSubscriberDetailsCacheKey(
					siteId,
					subscriber.subscription_id,
					subscriber.user_id,
					getSubscriberDetailsType( subscriber.user_id )
				);

				await queryClient.cancelQueries( cacheKey );

				previousDetailsData = queryClient.getQueryData< Subscriber >( cacheKey );
			}

			return {
				previousPages,
				previousDetailsData,
			};
		},
		onError: ( error, variables, context ) => {
			if ( context?.previousPages ) {
				context.previousPages?.forEach( ( previousSubscribers, page ) => {
					queryClient.setQueryData( getSubscribersCacheKey( siteId, page ), previousSubscribers );
				} );
			}

			if ( context?.previousDetailsData ) {
				const cacheKey = getSubscriberDetailsCacheKey(
					siteId,
					context.previousDetailsData.subscription_id,
					context.previousDetailsData.user_id,
					getSubscriberDetailsType( context.previousDetailsData.user_id )
				);

				queryClient.setQueryData( cacheKey, context.previousDetailsData );
			}
		},
		onSuccess: ( data, subscriber ) => {
			recordSubscriberRemoved( {
				site_id: siteId,
				subscription_id: subscriber.subscription_id,
				user_id: subscriber.user_id,
			} );
		},
		onSettled: ( data, error, subscriber ) => {
			queryClient.invalidateQueries( getSubscribersCacheKey( siteId ) );

			if ( invalidateDetailsCache ) {
				const cacheKey = getSubscriberDetailsCacheKey(
					siteId,
					subscriber.subscription_id,
					subscriber.user_id,
					getSubscriberDetailsType( subscriber.user_id )
				);

				queryClient.invalidateQueries( cacheKey );
			}
		},
	} );
};

export default useSubscriberRemoveMutation;
