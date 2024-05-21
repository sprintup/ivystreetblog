// app/api/reading-list/[bookId]/route.js

import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { UpdateTrackedBookInteractor } from "@/interactors/user/UpdateTrackedBookInteractor";
import { DeleteTrackedBookInteractor } from "@/interactors/user/DeleteTrackedBookInteractor";

export async function PUT(request, { params }) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = params;
  const body = await request.json(); // This will contain all the data sent in the body of the request

  const updateTrackedBookInteractor = await UpdateTrackedBookInteractor.create();
  await updateTrackedBookInteractor.execute(session.user.email, bookId, body.status); // Use body.status here

  return new Response("Book status updated", { status: 200 });
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = params;

  const deleteTrackedBookInteractor = await DeleteTrackedBookInteractor.create();
  await deleteTrackedBookInteractor.execute(session.user.email, bookId);

  return new Response("Book removed from reading list", { status: 200 });
}
