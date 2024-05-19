
import { ReadPublicBooklistInteractor } from "@/interactors/booklists/ReadPublicBooklistInteractor";
import { UpdateBooklistInteractor } from "@interactors/booklists/UpdateBooklistInteractor";
import { DeleteBooklistInteractor } from "@interactors/booklists/DeleteBooklistInteractor";

export async function GET(request, { params }) {
  try {
    const booklistId = params.id;
    const readBooklistInteractor = await ReadPublicBooklistInteractor.create();
    const booklist = await readBooklistInteractor.execute(booklistId);
    if (booklist) {
      return new Response(JSON.stringify(booklist), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Booklist not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const booklistId = params.id;
    const { title, description, visibility } = await request.json();
    const updateBooklistInteractor = await UpdateBooklistInteractor.create();
    const updatedBooklist = await updateBooklistInteractor.execute(booklistId, { title, description, visibility });
    if (updatedBooklist) {
      return new Response(JSON.stringify(updatedBooklist), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Booklist not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
  }
}
// TODO MAKE SURE ITS THE RIGHT USER
// TODO MAKE SURE THIS DELETES THE NESTED BOOKS OR CREATE A PAGE THAT SHOWS THE UNTETHERED BOOKS
export async function DELETE(request, { params }) {
  const deleteBooklistInteractor = await DeleteBooklistInteractor.create();
  try {
    const booklistId = params.id;
    const removedBooklist = await deleteBooklistInteractor.execute(booklistId);
    if (removedBooklist) {
      return new Response(JSON.stringify({ message: "Booklist deleted successfully" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Booklist not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
  }
}