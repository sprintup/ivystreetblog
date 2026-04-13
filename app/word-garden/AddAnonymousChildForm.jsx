'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

function formatMonthValue(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function shiftMonth(monthOffset) {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + monthOffset);
  return formatMonthValue(date);
}

export default function AddAnonymousChildForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [birthYearMonth, setBirthYearMonth] = useState('');
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthRange = useMemo(
    () => ({
      min: shiftMonth(-96),
      max: shiftMonth(-24),
    }),
    []
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/word-garden/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName,
          birthYearMonth,
          waiverAccepted,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unable to save this child.' }));
        setErrorMessage(data.error || 'Unable to save this child.');
        return;
      }

      setDisplayName('');
      setBirthYearMonth('');
      setWaiverAccepted(false);
      setSuccessMessage('Anonymous child added to your Word Garden.');
      router.refresh();
    } catch (error) {
      console.error('Error creating anonymous child:', error);
      setErrorMessage('Something went wrong while creating the child profile.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-secondary/70 border border-accent/30 rounded-3xl p-6 shadow-lg'
    >
      <h2 className='text-2xl font-bold text-yellow mb-3'>Add An Anonymous Child</h2>
      <p className='text-sm text-accent mb-6'>
        Use a parent-approved nickname like a favorite food, color, or animal. Word Garden is designed for children ages 24-96 months.
      </p>
      {errorMessage ? <p className='text-red-300 mb-4'>{errorMessage}</p> : null}
      {successMessage ? <p className='text-green-300 mb-4'>{successMessage}</p> : null}
      <div className='space-y-4'>
        <label className='block'>
          <span className='block text-sm uppercase tracking-wide text-accent mb-2'>Display Name</span>
          <input
            type='text'
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            placeholder='Blueberries'
            className='w-full rounded-xl bg-primary border border-accent/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow'
            maxLength={40}
            required
          />
        </label>
        <label className='block'>
          <span className='block text-sm uppercase tracking-wide text-accent mb-2'>Birth Month</span>
          <input
            type='month'
            value={birthYearMonth}
            onChange={event => setBirthYearMonth(event.target.value)}
            min={monthRange.min}
            max={monthRange.max}
            className='word-garden-month-input w-full rounded-xl bg-primary border border-accent/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow'
            required
          />
        </label>
        <label className='flex items-start gap-3 rounded-2xl bg-primary/60 p-4'>
          <input
            type='checkbox'
            checked={waiverAccepted}
            onChange={event => setWaiverAccepted(event.target.checked)}
            className='mt-1 h-4 w-4 rounded border-accent/40'
            required
          />
          <span className='text-sm text-accent'>
            I understand that Word Garden offers caregiver support ideas, not medical advice, and I accept responsibility for how I use these suggestions with my child.
          </span>
        </label>
      </div>
      <button
        type='submit'
        disabled={isSubmitting}
        className='mt-6 inline-flex items-center rounded-full bg-yellow px-5 py-3 font-bold text-primary no-underline transition hover:bg-orange disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? 'Saving...' : 'Add To Garden'}
      </button>
    </form>
  );
}
