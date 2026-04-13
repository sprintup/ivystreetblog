import Link from 'next/link';
import { getAnonymousChildOrNotFound } from '../wordGardenServer';
import SoundTable from '../../word-garden/SoundTable';
import {
  buildLevelOneRows,
  calculateAgeInMonths,
} from '@/utils/wordGardenData';

export default async function WordGardenLevelOnePage({ params }) {
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}`
  );
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const rows = buildLevelOneRows(ageInMonths, anonymousChild.practicedWords);

  return (
    <section className='space-y-8'>
      <div className='flex flex-wrap items-center gap-3 text-sm text-accent'>
        <Link href='/word-garden' className='text-yellow hover:text-orange'>
          Word Garden
        </Link>
        <span>/</span>
        <span>Sound Table</span>
      </div>

      <div className='rounded-[2rem] bg-secondary/80 border border-accent/20 p-8 shadow-xl'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <p className='text-sm uppercase tracking-[0.35em] text-yellow mb-3'>
              Level 1
            </p>
            <h1 className='text-4xl text-white'>Sound Table</h1>
            <p className='text-accent mt-3 max-w-3xl'>
              Each letter has its own row, with matching phoneme rows directly
              underneath. Every letter is available to explore by default, even
              if the child is not yet ready to express every matching phoneme.
              A child may be able to learn a sound receptively before they can
              say it clearly. Green sounds are available right now, italic
              sounds were inherited from earlier months, and any clickable row
              will open the next word-cloud level.
            </p>
          </div>
          <div className='rounded-3xl bg-primary/70 px-5 py-4 text-sm text-accent min-w-[220px]'>
            <p>Child: {anonymousChild.displayName}</p>
            <p>Age: {ageInMonths} months</p>
            <p>Birth month: {anonymousChild.birthYearMonth}</p>
            <p>Practiced words: {anonymousChild.practicedWords.length}</p>
          </div>
        </div>
      </div>

      <SoundTable acId={params.acId} rows={rows} />
    </section>
  );
}
