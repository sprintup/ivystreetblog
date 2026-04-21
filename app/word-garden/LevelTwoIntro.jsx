import Link from 'next/link';

export default function LevelTwoIntro({
  acId = '',
  relatedPills = [],
  selectionNote = '',
  topNote = '',
  topNoteTone = 'neutral',
  statusNote = '',
  statusNoteTone = 'neutral',
}) {
  const getToneClassName = tone =>
    tone === 'ready'
      ? 'border-green-300/30 bg-green-400/10 text-green-300'
      : tone === 'advanced'
        ? 'border-yellow/30 bg-yellow/10 text-yellow'
        : tone === 'hard'
          ? 'border-orange/30 bg-primary/45 text-orange'
          : 'border-accent/25 bg-primary/45 text-accent';

  const notes = [
    topNote
      ? {
          key: `top-${topNote}`,
          text: topNote,
          className: getToneClassName(topNoteTone),
        }
      : null,
    statusNote
      ? {
          key: `status-${statusNote}`,
          text: statusNote,
          className: getToneClassName(statusNoteTone),
        }
      : null,
  ].filter(Boolean);

  return (
    <div className='rounded-[2rem] border border-accent/20 bg-secondary/80 p-8 shadow-xl'>
      <h1 className='text-4xl text-white'>
        {selectionNote ? `Word Cloud for ${selectionNote}` : 'Word Cloud'}
      </h1>
      {notes.length > 0 ? (
        <div className='mt-4 flex flex-wrap gap-3'>
          {notes.map(note => (
            <div
              key={note.key}
              className={`inline-flex rounded-full border px-4 py-2 text-sm ${note.className}`}
            >
              {note.text}
            </div>
          ))}
          {relatedPills.map(pill => (
            <Link
              key={pill.key}
              href={pill.href}
              className={`inline-flex rounded-full border px-4 py-2 text-sm no-underline transition ${
                pill.isUnlocked
                  ? 'border-yellow/30 bg-yellow/10 text-yellow hover:border-yellow/45 hover:bg-yellow/15'
                  : 'border-accent/25 bg-primary/45 text-accent hover:border-accent/40 hover:text-white'
              }`}
            >
              {pill.text}
            </Link>
          ))}
        </div>
      ) : null}
      <details className='mt-5 max-w-3xl rounded-3xl border border-accent/20 bg-primary/35 p-5 text-accent'>
        <summary className='cursor-pointer text-sm font-semibold uppercase tracking-[0.3em] text-yellow'>
          Instructions
        </summary>
        <div className='mt-4 space-y-4'>
          <p>
            Browse every available Word Garden target in one place. Children
            typically understand concrete words with tangible meanings more easily
            than abstract words.
          </p>
          <p>
            These words were selected for their academic nature, which supports
            children as they reach school, where communication is often more academic.
          </p>
          <p>
            Abstract words begin unchecked until the concrete words in this set are
            learned, but you can turn them on whenever you want. Words you have
            already clicked shrink a little to make room for less-practiced choices.
          </p>
          <p>
            The letter and phoneme pills at the top show just a select few
            teaching targets, not every phoneme that exists. They are there to
            raise awareness that the sounds letters make can change depending on
            how the letters are used in a word.
          </p>
          {acId ? (
            <p>
              For instance for the letter{' '}
              <Link
                href={`/word-garden/${acId}/letter/T`}
                className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
              >
                T
              </Link>{' '}
              you will see multiple phoneme (sound) pills, like{' '}
              <Link
                href={`/word-garden/${acId}/phoneme/SH`}
                className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
              >
                /ʃ/
              </Link>
              , which also has multiple letters. Try clicking both and looking
              at the highlighted parts of the words below.
            </p>
          ) : null}
          <p>
            These words were pulled from Appendix B of{' '}
            <em>All About Words: Increasing Vocabulary in the Common Core Classroom, PreK-2</em>{' '}
            by Susan B. Neuman. View the source here:{' '}
            <a
              href='https://archive.org/details/allaboutwordsinc0000neum_u4h2/page/152/mode/2up'
              className='text-yellow underline decoration-dotted underline-offset-4 hover:text-orange'
            >
              Appendix B on Archive.org
            </a>
            .
          </p>
        </div>
      </details>
    </div>
  );
}
