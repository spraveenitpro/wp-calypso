import { translate } from 'i18n-calypso';
import Pagination from 'calypso/components/pagination';
import { EmptyListView } from 'calypso/my-sites/subscribers/components/empty-list-view';
import { NoSearchResults } from 'calypso/my-sites/subscribers/components/no-search-results';
import { SubscriberList } from 'calypso/my-sites/subscribers/components/subscriber-list';
import { SubscriberListActionsBar } from 'calypso/my-sites/subscribers/components/subscriber-list-actions-bar';
import { useSubscribersPage } from 'calypso/my-sites/subscribers/components/subscribers-page/subscribers-page-context';
import { Subscriber } from 'calypso/my-sites/subscribers/types';
import { useRecordSearch } from '../../tracks';
import { GrowYourAudience } from '../grow-your-audience';
import './style.scss';

type SubscriberListContainerProps = {
	onClickView: ( subscriber: Subscriber ) => void;
	onClickUnsubscribe: ( subscriber: Subscriber ) => void;
	setShowAddSubscribersModal: React.Dispatch< React.SetStateAction< boolean > >;
};

const SubscriberListContainer = ( {
	onClickView,
	onClickUnsubscribe,
	setShowAddSubscribersModal,
}: SubscriberListContainerProps ) => {
	const { grandTotal, total, perPage, page, pageClickCallback, searchTerm } = useSubscribersPage();
	useRecordSearch();

	return (
		<section className="subscriber-list-container">
			{ grandTotal ? (
				<>
					<div className="subscriber-list-container__header">
						<span className="subscriber-list-container__title">{ translate( 'Total' ) }</span>{ ' ' }
						<span className="subscriber-list-container__subscriber-count">{ total }</span>
					</div>
					<SubscriberListActionsBar />

					{ total ? (
						<SubscriberList onView={ onClickView } onUnsubscribe={ onClickUnsubscribe } />
					) : (
						<NoSearchResults
							searchTerm={ searchTerm }
							setShowAddSubscribersModal={ setShowAddSubscribersModal }
						/>
					) }

					<Pagination
						className="subscriber-list-container__pagination"
						page={ page }
						perPage={ perPage }
						total={ total }
						pageClick={ pageClickCallback }
					/>

					<GrowYourAudience />
				</>
			) : (
				<EmptyListView />
			) }
		</section>
	);
};

export default SubscriberListContainer;
