import { randomUUID } from 'crypto';
import {
  IAnonymousChild,
  IUser,
  IWordGardenDashboardChild,
  IWordGardenSurrogateSummary,
} from '@/domain/models';
import { BaseRepository } from '@/repositories/BaseRepository';

interface CreateAnonymousChildInput {
  displayName: string;
  birthYearMonth: string;
  waiverAcceptedAt: Date;
}

interface PracticeWordInput {
  word: string;
  practiceIncrement?: number;
  checklistIncrement?: number;
  resetChecklist?: boolean;
  checklistCheckedItemIds?: string[];
  openChecklist?: boolean;
  selectionType?: 'all' | 'letter' | 'phoneme' | null;
  selectionSlug?: string;
  selectionLetter?: string;
  setCurrentWord?: boolean;
}

function normalizeChecklistWordOrder(values: string[] | undefined): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map(value => normalizeWordValue(value))
        .filter(Boolean)
    )
  );
}

interface AnonymousChildAccess {
  user: IUser;
  anonymousChild: IAnonymousChild;
}

type DashboardUser = {
  _id: { toString(): string };
  name?: string;
  publicProfileName?: string;
  email?: string;
  acIds: Array<{ toString(): string }>;
};

export interface AcceptSharedAnonymousChildResult {
  anonymousChild: IAnonymousChild | null;
  status: 'added' | 'already-added' | 'not-found';
}

function normalizeIncrement(value: number | undefined): number {
  const normalizedValue = Number(value);

  if (!Number.isFinite(normalizedValue) || normalizedValue < 0) {
    return 0;
  }

  return Math.floor(normalizedValue);
}

function normalizeWordValue(value: string | undefined): string {
  return String(value || '').trim().toLowerCase();
}

function normalizeChecklistItemIds(values: string[] | undefined): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map(value => String(value || '').trim())
        .filter(Boolean)
    )
  );
}

function normalizeSelectionType(
  value: PracticeWordInput['selectionType']
): 'all' | 'letter' | 'phoneme' | null {
  return value === 'all' || value === 'letter' || value === 'phoneme'
    ? value
    : null;
}

function normalizeSelectionSlug(value: string | undefined): string | null {
  const normalizedValue = String(value || '').trim();
  return normalizedValue || null;
}

function normalizeSelectionLetter(value: string | undefined): string | null {
  const normalizedValue = String(value || '')
    .trim()
    .charAt(0)
    .toUpperCase();

  return normalizedValue || null;
}

function hasOpenChecklist(practicedWord: {
  checklistCheckedItemIds?: string[];
  checklistSelectionType?: 'all' | 'letter' | 'phoneme' | null;
  checklistSelectionSlug?: string | null;
} | null | undefined) {
  const hasCheckedItems = Array.isArray(practicedWord?.checklistCheckedItemIds)
    ? practicedWord.checklistCheckedItemIds.length > 0
    : false;
  const hasSavedSelection =
    (practicedWord?.checklistSelectionType === 'all' ||
      practicedWord?.checklistSelectionType === 'letter' ||
      practicedWord?.checklistSelectionType === 'phoneme') &&
    Boolean(String(practicedWord?.checklistSelectionSlug || '').trim());

  return hasCheckedItems || hasSavedSelection;
}

function toIdString(value: { toString(): string } | string | null | undefined) {
  if (!value) {
    return '';
  }

  return value.toString();
}

function getUserDisplayName(user: {
  name?: string;
  publicProfileName?: string;
  email?: string;
}) {
  return (
    String(user?.name || user?.publicProfileName || user?.email || 'Unknown user').trim()
  );
}

export class AnonymousChildRepository extends BaseRepository {
  private getSortedStartedChecklistWords(anonymousChild: IAnonymousChild) {
    return [...this.getStartedChecklistWords(anonymousChild)].sort(
      (leftWord, rightWord) => {
        const leftTime = leftWord.checklistUpdatedAt
          ? new Date(leftWord.checklistUpdatedAt).getTime()
          : 0;
        const rightTime = rightWord.checklistUpdatedAt
          ? new Date(rightWord.checklistUpdatedAt).getTime()
          : 0;

        if (leftTime !== rightTime) {
          return rightTime - leftTime;
        }

        return leftWord.word.localeCompare(rightWord.word);
      }
    );
  }

  private applyChecklistWordOrder(
    anonymousChild: IAnonymousChild,
    preferredOrder: string[] | undefined = undefined
  ) {
    const startedChecklistWords = this.getSortedStartedChecklistWords(anonymousChild);
    const startedWordSet = new Set(startedChecklistWords.map(practicedWord => practicedWord.word));
    const normalizedOrder = normalizeChecklistWordOrder(
      preferredOrder ?? anonymousChild.checklistWordOrder
    ).filter(word => startedWordSet.has(word));
    const missingWords = startedChecklistWords
      .map(practicedWord => practicedWord.word)
      .filter(word => !normalizedOrder.includes(word));

    anonymousChild.checklistWordOrder = [...normalizedOrder, ...missingWords];
  }

  private getDisplayedChecklistWordOrder(anonymousChild: IAnonymousChild) {
    const startedChecklistWords = this.getSortedStartedChecklistWords(anonymousChild);
    const startedWordSet = new Set(startedChecklistWords.map(practicedWord => practicedWord.word));
    const normalizedOrder = normalizeChecklistWordOrder(
      anonymousChild.checklistWordOrder
    ).filter(word => startedWordSet.has(word));
    const missingWords = startedChecklistWords
      .map(practicedWord => practicedWord.word)
      .filter(word => !normalizedOrder.includes(word));
    const orderedWords = [...normalizedOrder, ...missingWords];
    const normalizedCurrentWord = normalizeWordValue(
      anonymousChild.currentChecklistWord || ''
    );

    if (!normalizedCurrentWord || !orderedWords.includes(normalizedCurrentWord)) {
      return orderedWords;
    }

    return [
      normalizedCurrentWord,
      ...orderedWords.filter(word => word !== normalizedCurrentWord),
    ];
  }

  private promoteChecklistWordToFront(
    anonymousChild: IAnonymousChild,
    preferredWord = ''
  ) {
    const normalizedPreferredWord = normalizeWordValue(preferredWord);

    if (!normalizedPreferredWord) {
      return;
    }

    const displayedOrder = this.getDisplayedChecklistWordOrder(anonymousChild);

    if (!displayedOrder.includes(normalizedPreferredWord)) {
      return;
    }

    anonymousChild.checklistWordOrder = [
      normalizedPreferredWord,
      ...displayedOrder.filter(word => word !== normalizedPreferredWord),
    ];
  }

  private getStartedChecklistWords(anonymousChild: IAnonymousChild) {
    return anonymousChild.practicedWords.filter(practicedWord =>
      hasOpenChecklist(practicedWord)
    );
  }

  private ensureCurrentChecklistWord(
    anonymousChild: IAnonymousChild,
    preferredWord = ''
  ) {
    const startedChecklistWords = this.getSortedStartedChecklistWords(anonymousChild);

    if (startedChecklistWords.length === 0) {
      anonymousChild.currentChecklistWord = null;
      return;
    }

    const normalizedPreferredWord = normalizeWordValue(preferredWord);
    if (
      normalizedPreferredWord &&
      startedChecklistWords.some(
        practicedWord => practicedWord.word === normalizedPreferredWord
      )
    ) {
      anonymousChild.currentChecklistWord = normalizedPreferredWord;
      return;
    }

    const normalizedCurrentWord = normalizeWordValue(
      anonymousChild.currentChecklistWord || ''
    );
    if (
      normalizedCurrentWord &&
      startedChecklistWords.some(
        practicedWord => practicedWord.word === normalizedCurrentWord
      )
    ) {
      anonymousChild.currentChecklistWord = normalizedCurrentWord;
      return;
    }

    const startedWordSet = new Set(
      startedChecklistWords.map(practicedWord => practicedWord.word)
    );
    const orderedStartedWords = normalizeChecklistWordOrder(
      anonymousChild.checklistWordOrder
    ).filter(word => startedWordSet.has(word));

    anonymousChild.currentChecklistWord =
      orderedStartedWords[0] || startedChecklistWords[0]?.word || null;
  }

  private async ensureAnonymousChildMetadata(
    anonymousChild: IAnonymousChild
  ): Promise<IAnonymousChild> {
    let didChange = false;

    if (!anonymousChild.originatorUserId) {
      const originatorUser = await this.User.findOne({ acIds: anonymousChild._id });

      if (originatorUser) {
        anonymousChild.originatorUserId = originatorUser._id;
        didChange = true;
      }
    }

    if (!anonymousChild.shareToken) {
      anonymousChild.shareToken = randomUUID();
      didChange = true;
    }

    const previousChecklistWordOrder = Array.isArray(anonymousChild.checklistWordOrder)
      ? [...anonymousChild.checklistWordOrder]
      : [];
    this.applyChecklistWordOrder(anonymousChild);
    if (
      JSON.stringify(anonymousChild.checklistWordOrder || []) !==
      JSON.stringify(previousChecklistWordOrder)
    ) {
      didChange = true;
    }

    const previousCurrentChecklistWord = anonymousChild.currentChecklistWord || null;
    this.ensureCurrentChecklistWord(anonymousChild);
    if ((anonymousChild.currentChecklistWord || null) !== previousCurrentChecklistWord) {
      didChange = true;
    }

    if (didChange) {
      await anonymousChild.save();
    }

    return anonymousChild;
  }

  private async getAnonymousChildAccessForUser(
    userEmail: string,
    acId: string
  ): Promise<AnonymousChildAccess | null> {
    const user = await this.User.findOne({ email: userEmail });
    if (!user) {
      return null;
    }

    const anonymousChild = await this.AnonymousChild.findOne({ acId });
    if (!anonymousChild) {
      return null;
    }

    await this.ensureAnonymousChildMetadata(anonymousChild);

    const hasAccess = user.acIds.some(
      childId => childId.toString() === anonymousChild._id.toString()
    );

    if (!hasAccess) {
      return null;
    }

    return {
      user,
      anonymousChild,
    };
  }

  private buildSurrogateSummaries(
    anonymousChild: IAnonymousChild,
    usersWithAccess: DashboardUser[]
  ): IWordGardenSurrogateSummary[] {
    const anonymousChildId = anonymousChild._id.toString();
    const originatorUserId = toIdString(anonymousChild.originatorUserId);

    return usersWithAccess
      .filter(user => {
        const hasChild = user.acIds.some(
          childId => childId.toString() === anonymousChildId
        );

        return hasChild && toIdString(user._id) !== originatorUserId;
      })
      .map(user => ({
        userId: toIdString(user._id),
        name: getUserDisplayName(user),
        email: String(user.email || ''),
      }))
      .sort((leftUser, rightUser) => leftUser.name.localeCompare(rightUser.name));
  }

  private buildDashboardChild(
    anonymousChild: IAnonymousChild,
    currentUserId: string,
    usersWithAccess: DashboardUser[]
  ): IWordGardenDashboardChild {
    const originatorUserId = toIdString(anonymousChild.originatorUserId);
    const originatorUser = usersWithAccess.find(
      user => toIdString(user._id) === originatorUserId
    );
    const surrogates = this.buildSurrogateSummaries(anonymousChild, usersWithAccess);
    const isOriginator = currentUserId === originatorUserId;

    return {
      acId: anonymousChild.acId,
      displayName: anonymousChild.displayName,
      birthYearMonth: anonymousChild.birthYearMonth,
      waiverAcceptedAt: anonymousChild.waiverAcceptedAt,
      practicedWords: anonymousChild.practicedWords,
      createdAt: anonymousChild.createdAt,
      updatedAt: anonymousChild.updatedAt,
      currentChecklistWord: anonymousChild.currentChecklistWord || null,
      isOriginator,
      shareToken: isOriginator ? anonymousChild.shareToken || null : null,
      surrogateCount: surrogates.length,
      surrogates: isOriginator ? surrogates : [],
      originatorName: originatorUser
        ? getUserDisplayName(originatorUser)
        : 'Unknown originator',
    };
  }

  async getWordGardenDashboardForUser(
    userEmail: string
  ): Promise<IWordGardenDashboardChild[] | null> {
    try {
      const user = await this.User.findOne({ email: userEmail });

      if (!user) {
        return null;
      }

      if (user.acIds.length === 0) {
        return [];
      }

      const anonymousChildren = await this.AnonymousChild.find({
        _id: { $in: user.acIds },
      }).exec();

      for (const anonymousChild of anonymousChildren) {
        await this.ensureAnonymousChildMetadata(anonymousChild);
      }

      const usersWithAccess = await this.User.find({
        acIds: { $in: anonymousChildren.map(anonymousChild => anonymousChild._id) },
      })
        .select('_id name publicProfileName email acIds')
        .lean()
        .exec();

      return anonymousChildren.map(anonymousChild =>
        this.buildDashboardChild(
          anonymousChild,
          user._id.toString(),
          usersWithAccess as DashboardUser[]
        )
      );
    } catch (error) {
      console.error('Error getting word garden dashboard for user:', error);
      throw error;
    }
  }

  async getAnonymousChildrenForUser(
    userEmail: string
  ): Promise<IAnonymousChild[] | null> {
    try {
      const user = await this.User.findOne({ email: userEmail })
        .populate('acIds')
        .lean()
        .exec();

      if (!user) {
        return null;
      }

      return (user.acIds as unknown as IAnonymousChild[]) || [];
    } catch (error) {
      console.error('Error getting anonymous children for user:', error);
      throw error;
    }
  }

  async createAnonymousChildForUser(
    userEmail: string,
    input: CreateAnonymousChildInput
  ): Promise<IAnonymousChild | null> {
    try {
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        return null;
      }

      const anonymousChild = new this.AnonymousChild({
        acId: randomUUID(),
        displayName: input.displayName,
        birthYearMonth: input.birthYearMonth,
        waiverAcceptedAt: input.waiverAcceptedAt,
        originatorUserId: user._id,
        shareToken: randomUUID(),
        currentChecklistWord: null,
        checklistWordOrder: [],
        practicedWords: [],
      });

      await anonymousChild.save();
      user.acIds.push(anonymousChild._id);
      await user.save();

      return anonymousChild;
    } catch (error) {
      console.error('Error creating anonymous child:', error);
      throw error;
    }
  }

  async getAnonymousChildForUser(
    userEmail: string,
    acId: string
  ): Promise<IAnonymousChild | null> {
    try {
      const access = await this.getAnonymousChildAccessForUser(userEmail, acId);
      return access?.anonymousChild || null;
    } catch (error) {
      console.error('Error getting anonymous child for user:', error);
      throw error;
    }
  }

  async deleteAnonymousChildForUser(
    userEmail: string,
    acId: string
  ): Promise<boolean> {
    try {
      const access = await this.getAnonymousChildAccessForUser(userEmail, acId);

      if (!access) {
        return false;
      }

      if (
        toIdString(access.anonymousChild.originatorUserId) !==
        toIdString(access.user._id)
      ) {
        return false;
      }

      await this.User.updateMany(
        { acIds: access.anonymousChild._id },
        { $pull: { acIds: access.anonymousChild._id } }
      );
      await this.AnonymousChild.deleteOne({ _id: access.anonymousChild._id });

      return true;
    } catch (error) {
      console.error('Error deleting anonymous child:', error);
      throw error;
    }
  }

  async recordWordPracticeForUser(
    userEmail: string,
    acId: string,
    input: PracticeWordInput
  ): Promise<IAnonymousChild | null> {
    try {
      const access = await this.getAnonymousChildAccessForUser(userEmail, acId);
      if (!access) {
        return null;
      }

      const { anonymousChild } = access;
      const normalizedWord = normalizeWordValue(input.word);
      const practiceIncrement = normalizeIncrement(input.practiceIncrement ?? 1);
      const checklistIncrement = normalizeIncrement(
        input.checklistIncrement ?? 0
      );
      const resetChecklist = Boolean(input.resetChecklist);
      const hasChecklistStateUpdate = Array.isArray(input.checklistCheckedItemIds);
      const checklistCheckedItemIds = normalizeChecklistItemIds(
        input.checklistCheckedItemIds
      );
      const openChecklist = Boolean(input.openChecklist);
      const selectionType = normalizeSelectionType(input.selectionType);
      const selectionSlug = normalizeSelectionSlug(input.selectionSlug);
      const selectionLetter = normalizeSelectionLetter(input.selectionLetter);
      const setCurrentWord = Boolean(input.setCurrentWord);
      const shouldKeepChecklistOpen = Boolean(
        openChecklist || checklistCheckedItemIds.length > 0
      );
      const existingWord = anonymousChild.practicedWords.find(
        practicedWord => practicedWord.word === normalizedWord
      );

      if (
        practiceIncrement === 0 &&
        checklistIncrement === 0 &&
        !resetChecklist &&
        !hasChecklistStateUpdate &&
        !setCurrentWord
      ) {
        return anonymousChild;
      }

      const shouldCreatePracticedWord =
        !existingWord &&
        !resetChecklist &&
        (practiceIncrement > 0 ||
          checklistIncrement > 0 ||
          (hasChecklistStateUpdate && shouldKeepChecklistOpen));

      let practicedWord = existingWord;

      if (shouldCreatePracticedWord) {
        anonymousChild.practicedWords.push({
          word: normalizedWord,
          practiceCount: practiceIncrement,
          completedChecklistCount: checklistIncrement,
          lastPracticedAt: new Date(),
          checklistCheckedItemIds,
          checklistSelectionType:
            shouldKeepChecklistOpen ? selectionType : null,
          checklistSelectionSlug:
            shouldKeepChecklistOpen ? selectionSlug : null,
          checklistSelectionLetter:
            shouldKeepChecklistOpen ? selectionLetter : null,
          checklistUpdatedAt:
            shouldKeepChecklistOpen ? new Date() : null,
        });

        practicedWord = anonymousChild.practicedWords.find(
          entry => entry.word === normalizedWord
        );
      }

      if (practicedWord) {
        practicedWord.practiceCount += existingWord ? practiceIncrement : 0;

        if (resetChecklist) {
          practicedWord.completedChecklistCount = 0;
          practicedWord.checklistCheckedItemIds = [];
          practicedWord.checklistSelectionType = null;
          practicedWord.checklistSelectionSlug = null;
          practicedWord.checklistSelectionLetter = null;
          practicedWord.checklistUpdatedAt = new Date();
        } else {
          practicedWord.completedChecklistCount += existingWord
            ? checklistIncrement
            : 0;
        }

        if (hasChecklistStateUpdate) {
          practicedWord.checklistCheckedItemIds = checklistCheckedItemIds;
          practicedWord.checklistSelectionType =
            shouldKeepChecklistOpen ? selectionType : null;
          practicedWord.checklistSelectionSlug =
            shouldKeepChecklistOpen ? selectionSlug : null;
          practicedWord.checklistSelectionLetter =
            shouldKeepChecklistOpen ? selectionLetter : null;
          practicedWord.checklistUpdatedAt = new Date();
        }

        if (checklistIncrement > 0) {
          practicedWord.checklistCheckedItemIds = [];
          practicedWord.checklistSelectionType = null;
          practicedWord.checklistSelectionSlug = null;
          practicedWord.checklistSelectionLetter = null;
          practicedWord.checklistUpdatedAt = new Date();
        }

        practicedWord.lastPracticedAt = new Date();
      }

      if (setCurrentWord && hasOpenChecklist(practicedWord)) {
        this.promoteChecklistWordToFront(anonymousChild, normalizedWord);
        this.ensureCurrentChecklistWord(anonymousChild, normalizedWord);
      } else if (
        (resetChecklist ||
          checklistIncrement > 0 ||
          (hasChecklistStateUpdate && !shouldKeepChecklistOpen)) &&
        normalizeWordValue(anonymousChild.currentChecklistWord || '') === normalizedWord
      ) {
        this.ensureCurrentChecklistWord(anonymousChild);
      } else {
        this.ensureCurrentChecklistWord(anonymousChild);
      }

      this.applyChecklistWordOrder(anonymousChild);

      await anonymousChild.save();
      return anonymousChild;
    } catch (error) {
      console.error('Error recording anonymous child word practice:', error);
      throw error;
    }
  }

  async reorderStartedChecklistsForUser(
    userEmail: string,
    acId: string,
    orderedWords: string[]
  ): Promise<IAnonymousChild | null> {
    try {
      const access = await this.getAnonymousChildAccessForUser(userEmail, acId);
      if (!access) {
        return null;
      }

      const { anonymousChild } = access;
      this.applyChecklistWordOrder(anonymousChild, orderedWords);
      this.ensureCurrentChecklistWord(anonymousChild);
      await anonymousChild.save();

      return anonymousChild;
    } catch (error) {
      console.error('Error reordering started checklists:', error);
      throw error;
    }
  }

  async addAnonymousChildToUserByShareToken(
    userEmail: string,
    shareToken: string
  ): Promise<AcceptSharedAnonymousChildResult> {
    try {
      const user = await this.User.findOne({ email: userEmail });

      if (!user) {
        return {
          anonymousChild: null,
          status: 'not-found',
        };
      }

      const anonymousChild = await this.AnonymousChild.findOne({ shareToken });

      if (!anonymousChild) {
        return {
          anonymousChild: null,
          status: 'not-found',
        };
      }

      await this.ensureAnonymousChildMetadata(anonymousChild);

      const alreadyAdded = user.acIds.some(
        childId => childId.toString() === anonymousChild._id.toString()
      );

      if (alreadyAdded) {
        return {
          anonymousChild,
          status: 'already-added',
        };
      }

      user.acIds.push(anonymousChild._id);
      await user.save();

      return {
        anonymousChild,
        status: 'added',
      };
    } catch (error) {
      console.error('Error adding anonymous child by share token:', error);
      throw error;
    }
  }

  async removeSurrogateFromAnonymousChild(
    userEmail: string,
    acId: string,
    surrogateUserId: string
  ): Promise<boolean> {
    try {
      const access = await this.getAnonymousChildAccessForUser(userEmail, acId);

      if (!access) {
        return false;
      }

      if (
        toIdString(access.anonymousChild.originatorUserId) !==
        toIdString(access.user._id)
      ) {
        return false;
      }

      if (toIdString(access.user._id) === surrogateUserId) {
        return false;
      }

      const surrogateUser = await this.User.findById(surrogateUserId);

      if (!surrogateUser) {
        return false;
      }

      const hadAccess = surrogateUser.acIds.some(
        childId => childId.toString() === access.anonymousChild._id.toString()
      );

      if (!hadAccess) {
        return false;
      }

      surrogateUser.acIds = surrogateUser.acIds.filter(
        childId => childId.toString() !== access.anonymousChild._id.toString()
      );
      await surrogateUser.save();

      return true;
    } catch (error) {
      console.error('Error removing surrogate from anonymous child:', error);
      throw error;
    }
  }

  async getUserByEmail(userEmail: string): Promise<IUser | null> {
    try {
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error getting user for anonymous child operations:', error);
      throw error;
    }
  }
}
