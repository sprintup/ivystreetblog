import { ArchiveBookInUserCollectionInteractor } from "@/interactors/book/ArchiveBookInUserCollectionInteractor";

export async function PUT(request) {
    try {
        const { bookId } = await request.json();
        const archiveBookInteractor = await ArchiveBookInUserCollectionInteractor.create();
        await archiveBookInteractor.execute(bookId);
        return new Response(JSON.stringify({ message: "Book archived successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error archiving book:", error);
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}