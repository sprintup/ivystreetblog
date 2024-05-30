// app/api/booklist/route.js
import { CreateBooklistInteractor } from "@interactors/booklists/CreateBooklistInteractor"
import { ReadMyBookShelfInteractor } from '@/interactors/booklists/private/ReadMyBookShelfInteractor';

export async function GET(request) {
  console.log("Request", request.url)
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get('userEmail');

  if (!userEmail) {
    return new Response(JSON.stringify({ error: 'User email is required' }), {
      status: 400,
    });
  }

  try {
    const readBooklistsInteractor = await ReadMyBookShelfInteractor.create();
    const booklists = await readBooklistsInteractor.execute(userEmail);

    if (booklists) {
      return new Response(JSON.stringify(booklists), {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
    } else {
      console.error('No booklists found for the provided email:', userEmail);
      return new Response(
        JSON.stringify({ error: 'No booklists found for the provided email' }),
        { status: 404 }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const { userEmail, booklist } = await request.json();
  const createBooklistInteractor = await CreateBooklistInteractor.create();
  try {
    const result = await createBooklistInteractor.execute(userEmail, booklist);
    if (result) {
      return new Response(JSON.stringify(result), { status: 200 });
    } else {
      console.error("No user found with the provided email:", userEmail);
      return new Response(
        JSON.stringify({ error: "No user found with the provided email" }),
        { status: 404 }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
    });
  }
}

