//app\api\reading-list\route.js

import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { CreateTrackedBookInteractor } from "@/interactors/user/CreateTrackedBookInteractor";

export async function POST(request) {
    const session = await getServerSession(options);

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { bookId } = await request.json();

    try {
        const createTrackedBookInteractor = await CreateTrackedBookInteractor.create();
        const updatedUser = await createTrackedBookInteractor.execute(session.user.email, bookId);
        if (!updatedUser) {
            return new Response("User not found", { status: 404 });
        }
        return new Response("Book added to tracked books", { status: 200 });
    } catch (error) {
        console.error("Error adding book to tracked books:", error);
        return new Response("Failed to add book to tracked books", { status: 500 });
    }
}