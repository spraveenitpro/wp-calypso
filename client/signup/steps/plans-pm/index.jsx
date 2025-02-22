import { Button } from '@automattic/components';
import { isDesktop, subscribeIsDesktop } from '@automattic/viewport';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import { Component } from 'react';
import { connect } from 'react-redux';
import QueryPlans from 'calypso/components/data/query-plans';
import { LoadingEllipsis } from 'calypso/components/loading-ellipsis';
import MarketingMessage from 'calypso/components/marketing-message';
import Notice from 'calypso/components/notice';
import { buildUpgradeFunction } from 'calypso/lib/signup/step-actions';
import StepWrapper from 'calypso/signup/step-wrapper';
import { getDomainName, getIntervalType } from 'calypso/signup/steps/plans/util';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { errorNotice } from 'calypso/state/notices/actions';
import { saveSignupStep, submitSignupStep } from 'calypso/state/signup/progress/actions';
import PlansFeaturesMainPM from './plans-features-main-pm';
import 'calypso/signup/steps/plans/style.scss';

export class PlansStepPM extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isDesktop: isDesktop(),
		};
	}
	componentDidMount() {
		this.unsubscribe = subscribeIsDesktop( ( matchesDesktop ) =>
			this.setState( { isDesktop: matchesDesktop } )
		);
		this.props.saveSignupStep( { stepName: this.props.stepName } );
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	plansFeaturesList() {
		const { flowName } = this.props;

		let errorDisplay;
		if ( 'invalid' === this.props.step?.status ) {
			errorDisplay = (
				<div>
					<Notice status="is-error" showDismiss={ false }>
						{ this.props.step.errors.message }
					</Notice>
				</div>
			);
		}

		return (
			<div>
				{ errorDisplay }
				<PlansFeaturesMainPM
					site={ {} }
					hideFreePlan={ true }
					intervalType={ getIntervalType() }
					onUpgradeClick={ ( cartItem ) => buildUpgradeFunction( this.props, cartItem ) }
					domainName={ getDomainName( this.props.signupDependencies.domainItem ) }
					plansWithScroll={ this.state.isDesktop }
					flowName={ flowName }
					isAllPaidPlansShown={ true }
					isInSignup={ true }
					shouldShowPlansFeatureComparison={ this.state.isDesktop } // Show feature comparison layout in signup flow and desktop resolutions
				/>
			</div>
		);
	}

	getHeaderText() {
		const { headerText, translate } = this.props;

		if ( headerText ) {
			return headerText;
		}

		if ( this.state.isDesktop ) {
			return translate( 'Choose a plan' );
		}

		return translate( "Pick a plan that's right for you." );
	}

	getSubHeaderText() {
		const { translate } = this.props;
		const freePlanButton = (
			<Button onClick={ () => buildUpgradeFunction( this.props, null ) } borderless />
		);

		if ( this.props.hideFreePlan ) {
			if ( this.state.isDesktop ) {
				return translate( "Pick one that's right for you and unlock features that help you grow." );
			}

			return translate( 'Choose a plan.' );
		}

		if ( this.state.isDesktop ) {
			return translate(
				"Pick one that's right for you and unlock features that help you grow. Or {{link}}start with a free site{{/link}}.",
				{ components: { link: freePlanButton } }
			);
		}

		return translate( 'Choose a plan or {{link}}start with a free site{{/link}}.', {
			components: { link: freePlanButton },
		} );
	}

	plansFeaturesSelection() {
		const { flowName, stepName, positionInFlow, steps } = this.props;
		const headerText = this.getHeaderText();
		const fallbackHeaderText = this.props.fallbackHeaderText || headerText;
		const subHeaderText = this.getSubHeaderText();
		const fallbackSubHeaderText = this.props.fallbackSubHeaderText || subHeaderText;

		const previousStepName = steps[ this.props.positionInFlow - 1 ];
		const previousStep = this.props.progress?.[ previousStepName ];
		const isComingFromUseYourDomainStep = 'use-your-domain' === previousStep?.stepSectionName;
		let queryParams;

		if ( isComingFromUseYourDomainStep ) {
			queryParams = {
				...this.props.queryParams,
				step: 'transfer-or-connect',
				initialQuery: previousStep?.siteUrl,
			};
		}

		return (
			<>
				<StepWrapper
					flowName={ flowName }
					stepName={ stepName }
					positionInFlow={ positionInFlow }
					headerText={ headerText }
					fallbackHeaderText={ fallbackHeaderText }
					subHeaderText={ subHeaderText }
					fallbackSubHeaderText={ fallbackSubHeaderText }
					stepContent={ this.plansFeaturesList() }
					queryParams={ queryParams }
				/>
			</>
		);
	}

	renderLoading() {
		return (
			<div className="plans__loading">
				<LoadingEllipsis active />
			</div>
		);
	}

	render() {
		const classes = classNames( 'plans plans-step', {
			'in-vertically-scrolled-plans-experiment': true,
			'has-no-sidebar': false,
			'is-wide-layout': true,
		} );

		return (
			<>
				<QueryPlans />
				<MarketingMessage path="signup/plans" />
				<div className={ classes }>{ this.plansFeaturesSelection() }</div>
			</>
		);
	}
}

export default connect( null, {
	recordTracksEvent,
	saveSignupStep,
	submitSignupStep,
	errorNotice,
} )( localize( PlansStepPM ) );
