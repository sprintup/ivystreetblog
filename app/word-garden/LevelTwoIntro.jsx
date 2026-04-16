export default function LevelTwoIntro({ selectionNote = '', topNote = '' }) {
  const notes = [selectionNote, topNote].filter(Boolean);

  return (
    <div className='rounded-[2rem] border border-accent/20 bg-secondary/80 p-8 shadow-xl'>
      <h1 className='text-4xl text-white'>Word Cloud</h1>
      {notes.length > 0 ? (
        <div className='mt-4 flex flex-wrap gap-3'>
          {notes.map(note => (
            <div
              key={note}
              className='inline-flex rounded-full border border-accent/25 bg-primary/45 px-4 py-2 text-sm text-accent'
            >
              {note}
            </div>
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
