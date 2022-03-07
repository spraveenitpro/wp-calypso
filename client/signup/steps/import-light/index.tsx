import classnames from 'classnames';
import page from 'page';
import React, { useState, useEffect } from 'react';
import StepWrapper from 'calypso/signup/step-wrapper';
import Capture from './capture';
import Colors from './colors';
import Scanning from './scanning';
import Summary from './summary';
import type { FunctionComponent } from 'react';

import './style.scss';

interface Props {
	stepName: string;
	stepSectionName: string;
}
const ImportLight: FunctionComponent< Props > = ( props ) => {
	const COLORS = [
		{ name: 'Color 1', hex: '#17273A' },
		{ name: 'Color 2', hex: '#283A50' },
		{ name: 'Color 3', hex: '#EFEBEB' },
		{ name: 'Color 4', hex: '#94A4B9' },
	];
	const [ scanningProgress, setScanningProgress ] = useState( 0 );

	function runScan() {
		page.redirect( '/start/import-light/static/scanning' );
	}

	function runImport() {
		page.redirect( '/start/import-light/static/colors' );
	}

	function runSummary() {
		page.redirect( '/start/import-light/static/summary' );
	}

	useEffect( () => {
		const interval = setInterval( () => {
			if ( props.stepSectionName !== 'scanning' ) return;

			if ( scanningProgress === 100 ) {
				clearInterval( interval );
				runImport();
				setScanningProgress( 0 );
			}

			if ( scanningProgress === 0 ) {
				setScanningProgress( 14 );
			} else if ( scanningProgress < 25 ) {
				setScanningProgress( 25 );
			} else if ( scanningProgress < 75 ) {
				setScanningProgress( 75 );
			} else {
				setScanningProgress( 100 );
			}
		}, 630 );

		return () => clearInterval( interval );
	} );

	return (
		<StepWrapper
			flowName={ 'import-light' }
			stepName={ props.stepName }
			stepSectionName={ props.stepSectionName }
			hideSkip={ false }
			hideNext={ false }
			hideBack={ false }
			hideFormattedHeader={ true }
			nextLabelText={ 'Skip this step' }
			shouldHideNavButtons={ false }
			stepContent={
				<div className={ classnames( 'import__onboarding-page' ) }>
					{ ! props.stepSectionName && <Capture startScan={ runScan } /> }
					{ props.stepSectionName === 'scanning' && <Scanning progress={ scanningProgress } /> }
					{ props.stepSectionName === 'colors' && (
						<Colors colors={ COLORS } onAnimationFinished={ runSummary } />
					) }
					{ props.stepSectionName === 'summary' && <Summary /> }
				</div>
			}
		/>
	);
};

export default ImportLight;
