/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import WapuuEar from 'calypso/assets/images/odysseus/wapuu-inverse-ear.png';
import Wapuu from 'calypso/assets/images/odysseus/wapuu-inverse-no-ear-no-tail.png';
import WapuuTail from 'calypso/assets/images/odysseus/wapuu-inverse-tail.png';

const WapuuRibbon = ( {
	onToggleVisibility,
	isNudging,
	isLoading,
}: {
	onToggleVisibility: () => void;
	isNudging: boolean;
	isLoading: boolean;
} ) => {
	const handleToggleVisibility = () => {
		onToggleVisibility();
	};

	return (
		<>
			<img
				role="button"
				src={ Wapuu }
				alt="Chat"
				className="wapuu-image chatbox-toggle"
				onClick={ handleToggleVisibility }
			/>
			<img
				role="button"
				src={ WapuuEar }
				alt="Chat"
				className={ `wapuu-ear-image chatbox-toggle ${ isNudging ? 'wapuu-animation-nudge' : '' }` }
				onClick={ handleToggleVisibility }
			/>
			<img
				role="button"
				src={ WapuuTail }
				alt="Chat"
				className={ `wapuu-tail-image chatbox-toggle ${
					isLoading ? 'wapuu-animation-loading' : ''
				}` }
				onClick={ handleToggleVisibility }
			/>
		</>
	);
};

WapuuRibbon.propTypes = {
	onToggleVisibility: PropTypes.func.isRequired,
};

export default WapuuRibbon;
