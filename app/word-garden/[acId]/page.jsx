import Link from 'next/link';
import { getAnonymousChildOrNotFound } from '../wordGardenServer';
import SoundTable from '../../word-garden/SoundTable';
import {
  buildLevelOneRows,
  calculateAgeInMonths,
  getWordGardenCompletionSummary,
} from '@/utils/wordGardenData';

export default async function WordGardenLevelOnePage({ params }) {
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}`
  );
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const rows = buildLevelOneRows(ageInMonths, anonymousChild.practicedWords);
  const completionSummary = getWordGardenCompletionSummary(
    anonymousChild.practicedWords
  );

  return (
    <section className='space-y-8 pb-28 md:pb-32'>
      <div className='flex flex-wrap items-center gap-3 text-sm text-accent'>
        <Link href='/word-garden' className='text-yellow hover:text-orange'>
          Word Garden
        </Link>
        <span>/</span>
        <span>Sound Table</span>
      </div>

      <div className='rounded-[2rem] bg-secondary/80 border border-accent/20 p-8 shadow-xl'>
        <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]'>
          <div className='min-w-0 space-y-5'>
            <h1 className='text-4xl text-white'>Sound Table</h1>
            <details className='rounded-3xl border border-accent/20 bg-primary/30 p-5'>
              <summary className='cursor-pointer text-sm font-semibold uppercase tracking-[0.25em] text-yellow'>
                Instructions
              </summary>
              <div className='mt-4 grid gap-4 text-accent md:grid-cols-2'>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>How To Read The Table</p>
                  <p className='mt-2'>
                    Each letter has its own row, with matching phoneme rows
                    underneath. Phonemes are the specific sounds that are made,
                    and the sound rows are shown in IPA. Look at the example word
                    for a real pronunciation example.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>Development</p>
                  <p className='mt-2'>
                    The pace of development is different for every child, so this
                    table uses child age as a guide for when phonemes are released
                    for expressive practice, based on Chapter 2 of Pence Turnbull
                    and Justice (2016), page 36,
                    <em> Building Blocks of Language</em>.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>What Is Hidden</p>
                  <p className='mt-2'>
                    The sound table hides sounds the child is not currently
                    expected to be able to express. Letters are not hidden,
                    because building alphabet knowledge is still useful for
                    receptive learning even before expressive speech is ready.
                    Children can often understand words before they can express
                    them.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>Difficulty Labels</p>
                  <p className='mt-2'>
                    <strong>CV</strong> means consonant-vowel: the name of the
                    letter begins with the sound of the letter. <strong>VC</strong>{' '}
                    means vowel-consonant: the name of the letter ends with the
                    sound of the letter. <strong>Non</strong> means there is no
                    strong name-sound correlation, and vowels are shown as{' '}
                    <strong>Vowel</strong> because they are open sounds.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>Words And Sorting</p>
                  <p className='mt-2'>
                    Concrete words should usually be learned before abstract
                    words. <strong>Completed</strong> shows how many words already
                    have completed checklists. Click a header to sort, and
                    shift-click another header to add a secondary sort like a
                    spreadsheet.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4'>
                  <p className='text-sm font-semibold text-yellow'>Buttons And Checklists</p>
                  <p className='mt-2'>
                    <strong>Recommend</strong> picks a random unfinished word from
                    unlocked rows and exhausts concrete words before abstract
                    words. <strong>All words</strong> shows the full list and how
                    often words were opened. <strong>All unlocked words</strong>{' '}
                    shows the currently available set. <strong>Checklists</strong>{' '}
                    is where started words are saved, and <strong>Current word</strong>{' '}
                    jumps back into the main active checklist.
                  </p>
                </div>
                <div className='rounded-2xl border border-accent/15 bg-primary/30 p-4 md:col-span-2'>
                  <p className='text-sm font-semibold text-yellow'>Practice Notes</p>
                  <p className='mt-2'>
                    Hard letters should be practiced more than easy letters,
                    because the link between the letter name and letter sound
                    takes longer to establish. Green sounds are available right
                    now, italic sounds were inherited from earlier months, and
                    any clickable row opens the next word-cloud level. Use{' '}
                    <strong>Hide locked rows</strong> to focus on what is
                    available right now.
                  </p>
                  <p className='mt-3 text-sm'>
                    For more detail on started checklists, current word behavior,
                    and the bookmarkable current-word URL, open the{' '}
                    <Link
                      href={`/word-garden/${params.acId}/checklists`}
                      className='text-yellow hover:text-orange'
                    >
                      Checklists
                    </Link>{' '}
                    page.
                  </p>
                </div>
              </div>
            </details>
          </div>

          <aside>
            <p className='text-sm uppercase tracking-[0.35em] text-yellow mb-3'>
              Child Details
            </p>
            <div className='rounded-3xl bg-primary/70 px-5 py-4 text-sm text-accent min-w-[220px]'>
              <p>Child: {anonymousChild.displayName}</p>
              <p>Age: {ageInMonths} months</p>
              <p>Birth month: {anonymousChild.birthYearMonth}</p>
              <p>
                Completed: {completionSummary.completedCount}/
                {completionSummary.remainingCount}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <SoundTable
        acId={params.acId}
        hasCurrentWord={Boolean(anonymousChild.currentChecklistWord)}
        rows={rows}
      />
    </section>
  );
}
