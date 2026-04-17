import { redirect } from 'next/navigation';
import { getAnonymousChildOrNotFound } from '../../wordGardenServer';
import {
  buildWordGardenWordPath,
  calculateAgeInMonths,
  getCurrentChecklist,
  getRecommendedWordTarget,
  getStartedChecklists,
} from '@/utils/wordGardenData';

function getSingleSearchParamValue(value) {
  if (Array.isArray(value)) {
    return value[0] || '';
  }

  return value || '';
}

export default async function WordGardenCurrentWordPage({ params, searchParams }) {
  const { anonymousChild } = await getAnonymousChildOrNotFound(
    params.acId,
    `/word-garden/${params.acId}/current`
  );
  const ageInMonths = calculateAgeInMonths(anonymousChild.birthYearMonth);
  const excludedWord = getSingleSearchParamValue(searchParams?.exclude);
  const currentChecklist = getCurrentChecklist(
    anonymousChild.practicedWords,
    anonymousChild.currentChecklistWord
  );

  if (currentChecklist) {
    redirect(
      buildWordGardenWordPath(
        params.acId,
        currentChecklist.selectionType,
        currentChecklist.selectionSlug,
        currentChecklist.word,
        currentChecklist.selectionLetter
      )
    );
  }

  const startedChecklists = getStartedChecklists(
    anonymousChild.practicedWords,
    anonymousChild.currentChecklistWord
  );

  if (startedChecklists.length > 0) {
    const fallbackChecklist = startedChecklists[0];

    redirect(
      buildWordGardenWordPath(
        params.acId,
        fallbackChecklist.selectionType,
        fallbackChecklist.selectionSlug,
        fallbackChecklist.word,
        fallbackChecklist.selectionLetter
      )
    );
  }

  const recommendedTarget = getRecommendedWordTarget(
    ageInMonths,
    anonymousChild.practicedWords,
    excludedWord ? [excludedWord] : []
  );

  if (recommendedTarget) {
    redirect(
      buildWordGardenWordPath(
        params.acId,
        recommendedTarget.selectionType,
        recommendedTarget.selectionSlug,
        recommendedTarget.word,
        recommendedTarget.selectionLetter
      )
    );
  }

  redirect(`/word-garden/${params.acId}/checklists`);
}
