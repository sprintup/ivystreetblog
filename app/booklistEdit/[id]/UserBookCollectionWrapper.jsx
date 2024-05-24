//app\booklistEdit\[id]\UserBookCollectionWrapper.jsx
'use client';

import { useSession } from 'next-auth/react';
import UserBookCollectionComponent from '@components/UserBookCollectionComponent';
import AddToBooklistButtonComponent from './AddToBooklistButtonComponent';

export default function UserBookCollectionWrapper({ booklistId }) {
  const { data: session } = useSession();

  return (
    <UserBookCollectionComponent session={session}>
      {({ book }) => (
        <AddToBooklistButtonComponent book={book} booklistId={booklistId} />
      )}
    </UserBookCollectionComponent>
  );
}
