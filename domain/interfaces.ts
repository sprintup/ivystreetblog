export interface IBookData {
  Name: string;
  Author: string;
  // Add other book properties as needed
}

export interface RecommendBookData {
  bookId: string;
  recommendedBy: string;
  recommendationReason: string;
}
