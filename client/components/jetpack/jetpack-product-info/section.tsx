import { useMobileBreakpoint } from '@automattic/viewport-react';
import { FunctionComponent, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import FoldableCard from 'calypso/components/foldable-card';

type Props = {
	title: string;
	children: ReactNode;
};

const JetpackProductInfoSection: FunctionComponent< Props > = ( { title, children } ) => {
	const isMobileViewport = useMobileBreakpoint();

	const ref = useRef< HTMLDivElement | null >( null );
	const [ contentStyle, setContentStyle ] = useState( {} );

	useLayoutEffect( () => {
		const height = ref?.current?.scrollHeight || 250;
		setContentStyle( { maxHeight: `${ height }px` } );
	}, [ setContentStyle ] );

	return (
		<div className="jetpack-product-info__section" key={ title }>
			{ isMobileViewport ? (
				<FoldableCard
					hideSummary
					header={ title }
					clickableHeader={ true }
					smooth
					contentExpandedStyle={ contentStyle }
				>
					<div ref={ ref }>{ children }</div>
				</FoldableCard>
			) : (
				<>
					<h3 className="jetpack-product-info__section-title">{ title }</h3>

					{ children }
				</>
			) }
		</div>
	);
};

export default JetpackProductInfoSection;
