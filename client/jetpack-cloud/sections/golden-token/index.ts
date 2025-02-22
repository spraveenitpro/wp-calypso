import page from 'page';
import { makeLayout, render as clientRender } from 'calypso/controller/index.web';
import { goldenTokenContext } from './controller';

export default function (): void {
	page( '/golden-token', goldenTokenContext, makeLayout, clientRender );
}
