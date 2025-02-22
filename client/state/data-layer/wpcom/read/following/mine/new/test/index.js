import { NOTICE_CREATE } from 'calypso/state/action-types';
import { bypassDataLayer } from 'calypso/state/data-layer/utils';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { READER_FOLLOW_COMPLETE } from 'calypso/state/reader/action-types';
import { follow, unfollow } from 'calypso/state/reader/follows/actions';
import { requestFollow, receiveFollow, followError } from '../';

describe( 'requestFollow', () => {
	test( 'should dispatch a http request', () => {
		const action = follow( 'http://example.com' );
		const result = requestFollow( action );

		expect( result ).toEqual(
			http(
				{
					method: 'POST',
					path: '/read/following/mine/new',
					apiVersion: '1.1',
					body: {
						url: 'http://example.com',
						source: 'calypso',
					},
				},
				action
			)
		);
	} );
} );

describe( 'receiveFollow', () => {
	test( 'should dispatch updateFollow with new subscription info', () => {
		const action = follow( 'http://example.com' );
		const response = {
			subscribed: true,
			subscription: {
				ID: 1,
				URL: 'http://example.com',
				blog_ID: 2,
				feed_ID: 3,
				date_subscribed: '1976-09-15T12:00:00Z',
				delivery_methods: {},
				is_owner: false,
				last_updated: null,
			},
		};
		const result = receiveFollow( action, response );
		expect( result[ 0 ] ).toMatchObject(
			bypassDataLayer(
				follow( 'http://example.com', {
					ID: 1,
					URL: 'http://example.com',
					feed_URL: 'http://example.com',
					blog_ID: 2,
					feed_ID: 3,
					date_subscribed: 211636800000,
					delivery_methods: {},
					is_owner: false,
					last_updated: NaN,
				} )
			)
		);
		expect( result[ 1 ] ).toMatchObject( {
			type: READER_FOLLOW_COMPLETE,
			payload: {
				feedUrl: 'http://example.com',
			},
		} );
	} );

	test( 'should dispatch an error notice when subscribed is false', () => {
		const action = follow( 'http://example.com' );
		const response = {
			subscribed: false,
		};

		const result = receiveFollow( action, response );
		expect( result[ 0 ] ).toMatchObject( {
			type: NOTICE_CREATE,
			notice: {
				status: 'is-error',
			},
		} );
		expect( result[ 1 ] ).toMatchObject( {
			type: READER_FOLLOW_COMPLETE,
			payload: {
				feedUrl: 'http://example.com',
			},
		} );
		expect( result[ 2 ] ).toEqual( bypassDataLayer( unfollow( 'http://example.com' ) ) );
	} );
} );

describe( 'followError', () => {
	test( 'should dispatch an error notice', () => {
		const action = follow( 'http://example.com' );

		const result = followError( action );
		expect( result[ 0 ] ).toMatchObject( { type: NOTICE_CREATE } );
		expect( result[ 1 ] ).toMatchObject( {
			type: READER_FOLLOW_COMPLETE,
			payload: {
				feedUrl: 'http://example.com',
			},
		} );
		expect( result[ 2 ] ).toEqual( bypassDataLayer( unfollow( 'http://example.com' ) ) );
	} );
} );
