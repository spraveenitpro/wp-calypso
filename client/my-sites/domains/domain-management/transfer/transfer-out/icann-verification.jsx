import { Card, Button } from '@automattic/components';
import { localizeUrl } from '@automattic/i18n-utils';
import { localize } from 'i18n-calypso';
import { Component } from 'react';
import { connect } from 'react-redux';
import { resendIcannVerification } from 'calypso/lib/domains';
import { TRANSFER_DOMAIN_REGISTRATION } from 'calypso/lib/url/support';
import { errorNotice, successNotice } from 'calypso/state/notices/actions';

class IcannVerification extends Component {
	state = {
		submitting: false,
	};

	handleClick = () => {
		this.setState( { submitting: true } );

		resendIcannVerification( this.props.selectedDomainName, ( error ) => {
			if ( error ) {
				this.props.errorNotice( error.message );
			} else {
				this.props.successNotice(
					this.props.translate(
						'We sent the ICANN verification email to your ' +
							'email address. Please check your inbox and click the link in the email.'
					)
				);
			}

			this.setState( { submitting: false } );
		} );
	};

	render() {
		const { translate } = this.props;

		return (
			<div>
				<Card className="transfer-out__card">
					<p>
						{ translate(
							'You must verify your email address before you can transfer this domain. ' +
								'{{learnMoreLink}}Learn more.{{/learnMoreLink}}',
							{
								components: {
									learnMoreLink: (
										<a
											href={ localizeUrl( TRANSFER_DOMAIN_REGISTRATION ) }
											target="_blank"
											rel="noopener noreferrer"
										/>
									),
								},
							}
						) }
					</p>
					<Button
						className="transfer-out__action-button"
						onClick={ this.handleClick }
						disabled={ this.state.submitting }
						primary
					>
						{ translate( 'Resend Verification Email' ) }
					</Button>
				</Card>
			</div>
		);
	}
}

export default connect( null, {
	errorNotice,
	successNotice,
} )( localize( IcannVerification ) );
