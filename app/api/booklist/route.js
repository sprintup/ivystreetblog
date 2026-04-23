// app/api/booklist/route.js
import { CreateBooklistInteractor } from "@interactors/booklists/CreateBooklistInteractor"
import { ReadMyBookShelfInteractor } from '@/interactors/booklists/private/ReadMyBookShelfInteractor';
import { requireSessionUser } from '@/utils/authSession';

export async function GET(request) {
  const { userEmail, unauthorizedResponse } = await requireSessionUser();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
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
  const { userEmail, unauthorizedResponse } = await requireSessionUser();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const { booklist } = await request.json();
  const createBooklistInteractor = await CreateBooklistInteractor.create();
  try {
    const result = await createBooklistInteractor.execute(userEmail, booklist);
    if (result) {
      // Return the _id property as JSON
      return new Response(JSON.stringify({ _id: result._id }), { status: 200 });
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

