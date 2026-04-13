import { randomUUID } from 'crypto';
import { IAnonymousChild, IUser } from '@/domain/models';
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
}

function normalizeIncrement(value: number | undefined): number {
  const normalizedValue = Number(value);

  if (!Number.isFinite(normalizedValue) || normalizedValue < 0) {
    return 0;
  }

  return Math.floor(normalizedValue);
}

export class AnonymousChildRepository extends BaseRepository {
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
      const user = await this.User.findOne({ email: userEmail }).lean().exec();
      if (!user) {
        return null;
      }

      const anonymousChild = await this.AnonymousChild.findOne({ acId });
      if (!anonymousChild) {
        return null;
      }

      const hasAccess = user.acIds.some(
        childId => childId.toString() === anonymousChild._id.toString()
      );

      if (!hasAccess) {
        return null;
      }

      return anonymousChild;
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
      const user = await this.User.findOne({ email: userEmail });
      if (!user) {
        return false;
      }

      const anonymousChild = await this.AnonymousChild.findOne({ acId });
      if (!anonymousChild) {
        return false;
      }

      const hasAccess = user.acIds.some(
        childId => childId.toString() === anonymousChild._id.toString()
      );

      if (!hasAccess) {
        return false;
      }

      user.acIds = user.acIds.filter(
        childId => childId.toString() !== anonymousChild._id.toString()
      );
      await user.save();
      await this.AnonymousChild.deleteOne({ _id: anonymousChild._id });

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
      const anonymousChild = await this.getAnonymousChildForUser(userEmail, acId);
      if (!anonymousChild) {
        return null;
      }

      const normalizedWord = input.word.trim().toLowerCase();
      const practiceIncrement = normalizeIncrement(input.practiceIncrement ?? 1);
      const checklistIncrement = normalizeIncrement(
        input.checklistIncrement ?? 0
      );
      const existingWord = anonymousChild.practicedWords.find(
        practicedWord => practicedWord.word === normalizedWord
      );

      if (practiceIncrement === 0 && checklistIncrement === 0) {
        return anonymousChild;
      }

      if (existingWord) {
        existingWord.practiceCount += practiceIncrement;
        existingWord.completedChecklistCount += checklistIncrement;
        existingWord.lastPracticedAt = new Date();
      } else {
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
