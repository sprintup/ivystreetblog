// UpdateBooklistInteractor.ts

import { BaseInteractor } from "../BaseInteractor";
import { IBooklist } from "@/domain/models";

interface UpdateBooklistData {
  title?: string;
  description?: string;
  visibility?: string;
}

/**
 * UpdateBooklistInteractor
 *
 * As a user,
 * When I edit a booklist,
 * Then that booklist's data is updated.
 *
 * @param {string} booklistId - The ID of the booklist to update.
 * @param {UpdateBooklistData} updatedData - The updated data for the booklist.
 * @returns {Promise<IBooklist | null>} A promise that resolves to the updated booklist or null if not found.
 */
export class UpdateBooklistInteractor extends BaseInteractor {
  async execute(booklistId: string, updatedData: UpdateBooklistData): Promise<IBooklist | null> {
    try {
      const booklist = await this.Booklist.findByIdAndUpdate(
        booklistId,
        {
          $set: {
            title: updatedData.title,
            description: updatedData.description,
            visibility: updatedData.visibility,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
      if (!booklist) {
        console.error("No booklist found with the provided booklistId:", booklistId);
        return null;
      }
      return this.convertToPlainObject(booklist) as IBooklist;
    } catch (error) {
      console.error("Error updating booklist:", error);
      throw error;
    }
  }
}