'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const WORD_GARDEN_USER_GUIDE_HREF =
  'https://github.com/sprintup/ivystreetblog/blob/main/readme-userguide.md';
const BOOKLISTS_USER_GUIDE_HREF =
  'https://github.com/sprintup/ivystreetblog/blob/main/readme-booklists-userguide.md';

export default function Home() {
  const { data: session } = useSession();
  const wordGardenHref = session ? '/word-garden' : '/word-garden-info';

  return (
    <main className='space-y-10 pb-28'>
      <section className='rounded-[2rem] border border-accent/20 bg-gradient-to-br from-secondary via-primary to-primary p-8 shadow-xl'>
        <p className='mb-3 text-sm uppercase tracking-[0.35em] text-yellow'>
          Ivy Street Blog
        </p>
        <h1 className='max-w-4xl text-4xl font-bold text-white md:text-5xl'>
          Reading lists for readers, plus Word Garden for caregivers helping
          children learn to read.
        </h1>
        <div className='mt-5 max-w-4xl space-y-4 text-lg leading-8 text-accent'>
          <p>
            Ivy Street has two main sides. <strong>Word Garden</strong> is best
            used by caretakers of children under 8 who are still learning to
            read. The bookshelf side helps readers browse public booklists,
            organize personal booklists, and save books to a private reading
            list.
          </p>
          <p>
            A simple and fun way to use Word Garden is to do a{' '}
            <strong>word of the day</strong>. The words were chosen to build the
            kind of academic vocabulary children will need in school, and a good
            place to begin is often with words that share the same first letter
            as the child&apos;s name.
          </p>
          <p>
            The app is mobile friendly, so it works well for quick practice,
            checklists, and book browsing on a phone. Booklists are meant as
            recommendations for readers, but parental supervision is still
            advised when choosing books for children.
          </p>
        </div>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Link
            href='/word-garden-info'
            className='rounded-full bg-yellow px-5 py-3 font-bold text-primary no-underline'
          >
            Learn About Word Garden
          </Link>
          <Link
            href={wordGardenHref}
            className='rounded-full border border-yellow/30 px-5 py-3 font-bold text-yellow no-underline transition hover:border-yellow hover:text-white'
          >
            Open Word Garden
          </Link>
          <Link
            href='/public-bookshelf'
            className='rounded-full border border-accent/30 px-5 py-3 font-bold text-accent no-underline transition hover:border-yellow hover:text-yellow'
          >
            Browse Public Bookshelf
          </Link>
        </div>
      </section>

      <section className='grid gap-8 lg:grid-cols-2'>
        <article className='rounded-3xl border border-accent/20 bg-secondary/80 p-6 shadow-lg'>
          <h2 className='text-2xl text-yellow'>Word Garden</h2>
          <div className='mt-4 space-y-4 text-accent'>
            <p>
              Word Garden helps an adult guide one word at a time through
              sound, meaning, spelling, and related ideas. It is designed to be
              used with the child, not handed to the child as a self-use app.
            </p>
            <p>
              The three-step flow is straightforward: start at the{' '}
              <strong>Sound Table</strong>, open a <strong>Word Cloud</strong>,
              then work through the <strong>single-word checklist</strong> and
              printable worksheet.
            </p>
            <p>
              Because the checklist system saves progress and supports a current
              word, it works well for short daily practice sessions.
            </p>
          </div>
          <div className='mt-5 flex flex-wrap gap-3'>
            <Link
              href='/word-garden-info'
              className='rounded-full border border-yellow/30 px-4 py-2 font-semibold text-yellow no-underline transition hover:border-yellow hover:text-white'
            >
              Word Garden Info Page
            </Link>
            <a
              href={WORD_GARDEN_USER_GUIDE_HREF}
              className='rounded-full border border-accent/30 px-4 py-2 font-semibold text-accent no-underline transition hover:border-yellow hover:text-yellow'
              target='_blank'
              rel='noreferrer'
            >
              Word Garden User Guide
            </a>
          </div>
        </article>

        <article className='rounded-3xl border border-accent/20 bg-secondary/80 p-6 shadow-lg'>
          <h2 className='text-2xl text-yellow'>Bookshelf, Booklists, and Reading List</h2>
          <div className='mt-4 space-y-4 text-accent'>
            <p>
              The bookshelf side of Ivy Street is for organizing your own
              collection, building booklists, discovering public booklists, and
              saving quick finds to your reading list.
            </p>
            <p>
              <strong>My Bookshelf</strong> is where you create and manage your
              own booklists. The <strong>Public Bookshelf</strong> helps you
              discover lists from other users. The <strong>Reading List</strong>{' '}
              is your private save-for-later space.
            </p>
            <p>
              If you are choosing books for children, use these lists as
              starting-point recommendations and review selections with parental
              judgment.
            </p>
          </div>
          <div className='mt-5 flex flex-wrap gap-3'>
            <Link
              href='/public-bookshelf'
              className='rounded-full border border-yellow/30 px-4 py-2 font-semibold text-yellow no-underline transition hover:border-yellow hover:text-white'
            >
              Public Bookshelf
            </Link>
            <a
              href={BOOKLISTS_USER_GUIDE_HREF}
              className='rounded-full border border-accent/30 px-4 py-2 font-semibold text-accent no-underline transition hover:border-yellow hover:text-yellow'
              target='_blank'
              rel='noreferrer'
            >
              Booklists User Guide
            </a>
          </div>
        </article>
      </section>

      <section className='grid gap-8 lg:grid-cols-2'>
        <article className='rounded-3xl border border-accent/20 bg-primary/40 p-6 shadow-lg'>
          <h2 className='text-2xl text-yellow'>Good First Word Garden Routine</h2>
          <div className='mt-4 space-y-4 text-accent'>
            <p>
              Pick one word, work the checklist together, and stop. That is
              enough. A short word-of-the-day routine is often easier to sustain
              than trying to do too much at once.
            </p>
            <p>
              Starting with words that share the same first letter as the
              child&apos;s name can make the practice set feel more personal and
              memorable.
            </p>
          </div>
        </article>

        <article className='rounded-3xl border border-accent/20 bg-primary/40 p-6 shadow-lg'>
          <h2 className='text-2xl text-yellow'>Built For Real Use</h2>
          <div className='mt-4 space-y-4 text-accent'>
            <p>
              Ivy Street is designed to be practical on desktop and mobile, so
              you can check a word, reopen a checklist, or browse a list of
              books without needing a full workstation.
            </p>
            <p>
              Whether you are teaching a word in a spare minute or saving books
              to revisit later, the app is meant to support short, repeatable
              routines.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
