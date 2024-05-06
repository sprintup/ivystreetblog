
import { getBooklistById, updateBooklist, removeBooklist } from '@services/dataService';

export async function GET(request, { params }) {
    try {
      const booklistId = params.id;
      const booklist = await getBooklistById(booklistId);
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
      const updatedBooklist = await updateBooklist(booklistId, { title, description, visibility });
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
    try {
      const booklistId = params.id;
      const removedBooklist = await removeBooklist(booklistId);
      if (removedBooklist) {
        return new Response(JSON.stringify({ message: "Booklist deleted successfully" }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: "Booklist not found" }), { status: 404 });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
  }