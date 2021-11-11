/**
 * External Dependencies
 */
import { useRef, useMemo } from '@wordpress/element';
import classnames from 'classnames';
import { usePopper } from 'react-popper';
import type { Rect, Placement } from '@popperjs/core';

interface Props {
	referenceElementSelector: string;
}

const Spotlight: React.FunctionComponent< Props > = ( { referenceElementSelector } ) => {
	const popperElementRef = useRef( null );
	const referenceElement = document.querySelector( referenceElementSelector );
	const { styles: popperStyles, attributes: popperAttributes } = usePopper(
		referenceElement,
		popperElementRef?.current,
		{
			strategy: 'fixed',
			modifiers: [
				useMemo(
					() => ( {
						name: 'offset',
						options: {
							offset: ( {
								placement,
								reference,
								popper,
							}: {
								placement: Placement;
								reference: Rect;
								popper: Rect;
							} ): [ number, number ] => {
								if ( placement === 'bottom' ) {
									return [ 0, -( reference.height + ( popper.height - reference.height ) / 2 ) ];
								}
								return [ 0, 0 ];
							},
						},
					} ),
					[]
				),
			],
		}
	);

	const clipRepositionProps = referenceElement
		? {
				style: popperStyles?.popper,
				...popperAttributes?.popper,
		  }
		: null;

	return (
		<>
			<div
				className={ classnames( 'wpcom-editor-welcome-tour__spotlight-overlay', {
					'--visible': ! clipRepositionProps,
				} ) }
			/>
			<div
				className={ classnames( 'wpcom-editor-welcome-tour__spotlight-clip', {
					'--visible': clipRepositionProps,
				} ) }
				ref={ popperElementRef }
				{ ...clipRepositionProps }
			/>
		</>
	);
};

export default Spotlight;
