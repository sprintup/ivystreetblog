// app/profile/page.jsx

'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AccordionWrapper from '@/app/(components)/AccordionWrapper';
import Accordion from '@/app/(components)/Accordion';
import { whatIsProfileContent } from '@/app/faqs/accordionContent';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [publicProfileName, setPublicProfileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.user.email }),
        });
        if (response.ok) {
          const userProfile = await response.json();
          setPublicProfileName(userProfile.publicProfileName || '');
        } else {
          setErrorMessage('Failed to fetch user profile. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('An error occurred. Please try again.');
      }
    };

    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email, publicProfileName }),
      });
      if (response.ok) {
        // Profile updated successfully
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        router.refresh();
      } else if (response.status === 400) {
        const { error } = await response.json();
        setErrorMessage(error);
      } else {
        console.error('Error updating profile:', response.statusText);
        setErrorMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-primary text-accent p-4 rounded-lg max-w-4xl mx-auto'>
      <h1 className='text-4xl font-bold mb-4'>Profile</h1>
      <AccordionWrapper title='Show More Information'>
        <Accordion
          title='What is a public profile name?'
          content={whatIsProfileContent}
          isOpenByDefault={true}
        />
      </AccordionWrapper>
      {errorMessage && <p className='text-red-500 mb-4'>{errorMessage}</p>}
      {successMessage && (
        <p className='text-green-500 mb-4'>{successMessage}</p>
      )}
      <div className='mb-4'>
        <label className='block text-lg mb-2'>
          Public Profile Name:
          <input
            type='text'
            value={publicProfileName}
            onChange={e => setPublicProfileName(e.target.value)}
            className='w-full px-3 py-2 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow'
          />
        </label>
        <p className='text-sm text-gray-300 mt-2'>
          Your public profile name will be used as the base URL for sharing your
          public shelf. People can view your public bookshelf by visiting:
        </p>
        <p className='text-sm text-blue-300 mt-1'>
          <Link href={`/profile/${publicProfileName}`}>
            {typeof window !== 'undefined'
              ? `${window.location.origin}/profile/${publicProfileName}`
              : ''}
          </Link>
        </p>
      </div>
      <button
        onClick={handleUpdateProfile}
        className='px-4 py-2 bg-yellow text-primary font-bold rounded-lg hover:bg-orange transition duration-300'
      >
        Update Profile
      </button>
    </div>
  );
}
