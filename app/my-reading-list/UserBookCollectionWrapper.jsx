'use client';

import UserBookCollectionComponent from '@components/UserBookCollectionComponent';
import AddToReadingListButton from './AddToReadingListButton';

export default function UserBookCollectionWrapper({ session }) {
  return (
    <UserBookCollectionComponent session={session}>
      {({ book }) => <AddToReadingListButton book={book} />}
    </UserBookCollectionComponent>
  );
}
