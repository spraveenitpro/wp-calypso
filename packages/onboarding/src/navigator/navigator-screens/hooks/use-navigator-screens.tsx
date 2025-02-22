import { Button, Gridicon } from '@automattic/components';
import {
	__experimentalNavigatorBackButton as NavigatorBackButton,
	__experimentalNavigatorScreen as NavigatorScreen,
} from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';
import NavigatorHeader from '../../navigator-header';
import type { NavigatorScreenObject } from '../types';

const useNavigatorScreens = ( screens: NavigatorScreenObject[] ) => {
	const translate = useTranslate();

	return screens.map(
		( { path, label, title, description, hideBack, content, actionText, onSubmit, onBack } ) => (
			<NavigatorScreen key={ path } path={ path }>
				<>
					<NavigatorHeader
						title={ <>{ title ?? label }</> }
						description={ description }
						hideBack={ hideBack }
						onBack={ onBack }
					/>
					{ content }
					<div className="navigator-screen__footer">
						<NavigatorBackButton
							className="navigator-screen__footer-back-button"
							as={ Button }
							title={ translate( 'Back' ) }
							borderless={ true }
							aria-label={ translate( 'Navigate to the previous view' ) }
							onClick={ onBack }
						>
							<Gridicon icon="chevron-left" size={ 18 } />
							{ translate( 'Back' ) }
						</NavigatorBackButton>
						<NavigatorBackButton as={ Button } primary onClick={ onSubmit }>
							{ actionText }
						</NavigatorBackButton>
					</div>
				</>
			</NavigatorScreen>
		)
	);
};

export default useNavigatorScreens;
