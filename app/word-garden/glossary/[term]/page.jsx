import Link from 'next/link';
import { getGlossaryTerm, unslugifyTerm } from '@/utils/wordGardenData';

export default function WordGardenGlossaryPage({ params }) {
  const glossaryTerm = getGlossaryTerm(unslugifyTerm(params.term));

  return (
    <section className='space-y-6 max-w-3xl'>
      <div className='flex flex-wrap items-center gap-3 text-sm text-accent'>
        <Link href='/word-garden' className='text-yellow hover:text-orange'>
          Word Garden
        </Link>
        <span>/</span>
        <span>Glossary</span>
      </div>

      <div className='rounded-[2rem] bg-secondary/80 border border-accent/20 p-8 shadow-xl'>
        <p className='text-sm uppercase tracking-[0.35em] text-yellow mb-3'>Glossary</p>
        <h1 className='text-4xl text-white'>{glossaryTerm.term}</h1>
        <p className='text-accent mt-2'>{glossaryTerm.category}</p>
        <p className='text-lg text-accent mt-6'>{glossaryTerm.definition}</p>
      </div>
    </section>
  );
}
