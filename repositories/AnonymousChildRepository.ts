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
      const normalizedWord = input.word.trim().toLowerCase();
      const practiceIncrement = normalizeIncrement(input.practiceIncrement ?? 1);
      const checklistIncrement = normalizeIncrement(
        input.checklistIncrement ?? 0
      );
      const resetChecklist = Boolean(input.resetChecklist);
      const existingWord = anonymousChild.practicedWords.find(
        practicedWord => practicedWord.word === normalizedWord
      );

      if (practiceIncrement === 0 && checklistIncrement === 0 && !resetChecklist) {
        return anonymousChild;
      }

      if (existingWord) {
        existingWord.practiceCount += practiceIncrement;
        existingWord.completedChecklistCount = resetChecklist
          ? 0
          : existingWord.completedChecklistCount + checklistIncrement;
        existingWord.lastPracticedAt = new Date();
      } else if (!resetChecklist) {
        anonymousChild.practicedWords.push({
          word: normalizedWord,
          practiceCount: practiceIncrement,
          completedChecklistCount: checklistIncrement,
          lastPracticedAt: new Date(),
        });
      }

      await anonymousChild.save();
      return anonymousChild;
    } catch (error) {
      console.error('Error recording anonymous child word practice:', error);
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
