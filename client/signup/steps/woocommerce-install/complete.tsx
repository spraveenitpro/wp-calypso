import { BackButton, NextButton, SubTitle, Title } from '@automattic/onboarding';
import { useI18n } from '@wordpress/react-i18n';
import type { GoToStep } from '../../types';
import type { ReactElement } from 'react';

interface Props {
	goToStep: GoToStep;
}

export default function Complete( { goToStep }: Props ): ReactElement | null {
	const { __ } = useI18n();

	return (
		<>
			<div className="woocommerce-install__heading-wrapper">
				<div className="woocommerce-install__heading">
					<Title>{ __( 'Setup complete' ) }</Title>
					<SubTitle></SubTitle>

					<div className="woocommerce-install__buttons-group">
						<div>
							<BackButton onClick={ () => goToStep( 'confirm' ) } />
						</div>
					</div>
				</div>
			</div>
			<div className="woocommerce-install__content">
				<div>
					<NextButton onClick={ () => goToStep( 'confirm' ) }>{ __( 'Finish' ) }</NextButton>
				</div>
			</div>
		</>
	);
}
