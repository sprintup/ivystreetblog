// app/api/review/[bookId]/route.js

import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { CreateReviewOfTrackedBooksInteractor } from "@/interactors/user/CreateReviewOfTrackedBooksInteractor";

export async function PUT(request, { params }) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = params;
  const { review, ratingPerceivedDifficulty } = await request.json();

  try {
    const interactor = await CreateReviewOfTrackedBooksInteractor.create();
    await interactor.execute(session.user.email, bookId, review, ratingPerceivedDifficulty);
    return new Response("Review updated", { status: 200 });
  } catch (error) {
    console.error("Error updating review:", error);
    return new Response("Failed to update review", { status: 500 });
  }
}