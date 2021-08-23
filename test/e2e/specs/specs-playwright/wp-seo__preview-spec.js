import {
	DataHelper,
	LoginFlow,
	SidebarComponent,
	MarketingPage,
	setupHooks,
} from '@automattic/calypso-e2e';

describe( DataHelper.createSuiteTitle( 'SEO Preview Page' ), function () {
	let marketingPage;
	let page;

	setupHooks( ( args ) => {
		page = args.page;
	} );

	it( 'Log in', async function () {
		const loginFlow = new LoginFlow( page, 'wooCommerceUser' );
		await loginFlow.logIn();
	} );

	it( 'Navigate to Tools > Marketing page', async function () {
		const sidebarComponent = new SidebarComponent( page );
		await sidebarComponent.navigate( 'Tools', 'Marketing' );
	} );

	it( 'Click on Traffic tab', async function () {
		marketingPage = new MarketingPage( page );
		await marketingPage.clickTabItem( 'Traffic' );
	} );

	it( 'Enter SEO meta description', async function () {
		await marketingPage.enterWebsiteMetaInformation();
	} );

	it( 'Open and close SEO preview', async function () {
		await marketingPage.openSEOPreview();
		await marketingPage.closeSEOPreview();
	} );
} );
