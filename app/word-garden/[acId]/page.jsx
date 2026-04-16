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
          <div className='min-w-0'>
            <h1 className='text-4xl text-white'>Sound Table</h1>
            <details className='mt-5 rounded-3xl border border-accent/20 bg-primary/30 p-5'>
              <summary className='cursor-pointer text-sm font-semibold uppercase tracking-[0.25em] text-yellow'>
                Instructions
              </summary>
              <div className='mt-4 max-w-4xl space-y-4 text-accent'>
                <p>
                  Each letter has its own row, with matching phoneme rows directly
                  underneath. Phonemes are the specific sounds that are made, and
                  the sound rows are shown in IPA. Look at the example word for an
                  example of how to pronounce the phoneme in a real word.
                </p>
                <p>
                  The pace of development is different for every child, so this
                  table uses child age as a guide for when phonemes are released
                  for expressive practice, based on Chapter 2 of Pence Turnbull
                  and Justice (2016), page 36,
                  <em> Building Blocks of Language</em>.
                </p>
                <p>
                  The sound table hides sounds the child is not currently
                  expected to be able to express. Letters are not hidden,
                  because building alphabet knowledge is still useful for
                  receptive learning even before expressive speech is ready.
                  Children can often understand and comprehend words before they
                  can express them.
                </p>
                <p>
                  <strong>CV</strong> means consonant-vowel: the name of the
                  letter begins with the sound of the letter. <strong>VC</strong>{' '}
                  means vowel-consonant: the name of the letter ends with the
                  sound of the letter. <strong>Non</strong> means there is no
                  strong name-sound correlation, and vowels are shown as{' '}
                  <strong>Vowel</strong> because they are open sounds.
                </p>
                <p>
                  Concrete words should usually be learned before abstract words.
                  The <strong>Completed</strong> column shows how many words already
                  have completed checklists.
                </p>
                <p>
                  Click a header to sort. Shift-click another header to add a
                  secondary sort, like a spreadsheet.
                </p>
                <p>
                  <strong>Recommend</strong> picks a random unfinished word from
                  unlocked rows. It exhausts concrete words before abstract words.
                  <strong>All words</strong> opens the full word list, where each
                  word can show how many times it has been opened.{' '}
                  <strong>All unlocked words</strong> opens the current unlocked
                  word set, including completed words when available.
                </p>
                <p>
                  Hard letters should be practiced more than easy letters,
                  because the link between the letter name and letter sound
                  takes longer to establish. Green sounds are available
                  right now, italic sounds were inherited from earlier months,
                  and any clickable row opens the next word-cloud level. Use{' '}
                  <strong>Hide locked rows</strong> to keep the table focused on
                  what is available right now.
                </p>
              </div>
            </details>
          </div>

          <aside className='lg:pt-14'>
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

      <SoundTable acId={params.acId} rows={rows} />
    </section>
  );
}
