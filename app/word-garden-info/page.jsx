import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { options } from '@auth/options';

function getDashboardHref(session) {
  return session
    ? '/word-garden'
    : '/api/auth/signin?callbackUrl=/word-garden';
}

export default async function WordGardenInfoPage() {
  const session = await getServerSession(options);
  const dashboardHref = getDashboardHref(session);

  return (
    <section className='space-y-10 pb-40'>
      <div className='rounded-[2rem] bg-gradient-to-br from-secondary via-primary to-primary border border-accent/20 p-8 shadow-xl'>
        <p className='text-sm uppercase tracking-[0.35em] text-yellow mb-3'>
          Word Garden
        </p>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
          A playful way to connect meaning, sounds, spelling, and print.
        </h1>
        <p className='max-w-3xl text-lg text-accent'>
          Word Garden helps adults support vocabulary and speech-sound learning
          with anonymous child profiles, sound tables, word clouds, and printable
          worksheets that make practice feel more concrete and organized.
        </p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Link
            href={dashboardHref}
            className='rounded-full bg-yellow px-5 py-3 font-bold text-primary no-underline'
          >
            Open Word Garden Dashboard
          </Link>
          <Link
            href='/faqs'
            className='rounded-full border border-accent/30 px-5 py-3 font-bold text-accent no-underline hover:border-yellow hover:text-yellow'
          >
            Read FAQs
          </Link>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        <article className='rounded-3xl bg-secondary/80 border border-accent/20 p-6 shadow-lg'>
          <h2 className='text-2xl text-yellow'>Why It Helps</h2>
          <div className='mt-4 space-y-4 text-accent'>
            <p>
              The sound table gives adults a clear developmental map, while still
              allowing them to explore beyond what a child can express right now.
            </p>
            <p>
              Word clouds surface practice targets quickly, helping adults notice
              easier concrete words, more advanced abstract words, and already
              completed items at a glance instead of trying to think of words and
              activities on the spot.
            </p>
            <p>
              Level 3 pages combine definition work, sound mapping, onset-rime,
              related words, and printable activities so one word can be explored
              from several angles.
            </p>
          </div>
        </article>

        <article className='rounded-3xl bg-secondary/80 border border-accent/20 p-6 shadow-lg'>
          <h2 className='text-2xl text-yellow'>Built For Real Use</h2>
          <div className='mt-4 space-y-4 text-accent'>
            <p>
              Anonymous child profiles help keep practice organized without storing
              personally identifying information.
            </p>
            <p>
              Suggested-word counts and checklist completion help adults see what
              still needs attention instead of guessing where to go next.
            </p>
            <p>
              Printable worksheets make it easy to carry practice into therapy,
              school, or home routines, while the online checklist keeps progress
              connected to the dashboard.
            </p>
          </div>
        </article>
      </div>

      <div className='rounded-3xl bg-primary/40 border border-accent/20 p-6 shadow-lg'>
        <h2 className='text-2xl text-yellow'>What You Can Do In Word Garden</h2>
        <div className='mt-4 grid gap-4 md:grid-cols-2'>
          <div className='rounded-2xl bg-secondary/70 p-5 text-accent'>
            Create anonymous child profiles and organize practice by age and sound.
          </div>
          <div className='rounded-2xl bg-secondary/70 p-5 text-accent'>
            Explore letters, phonemes, and word clouds with developmental context.
          </div>
          <div className='rounded-2xl bg-secondary/70 p-5 text-accent'>
            Filter words by concrete, abstract, and completed practice status.
          </div>
          <div className='rounded-2xl bg-secondary/70 p-5 text-accent'>
            Print or generate worksheets that connect sound, meaning, and spelling.
          </div>
        </div>
      </div>
    </section>
  );
}
