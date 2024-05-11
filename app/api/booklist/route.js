// app/api/booklist/route.js
import { getUserIdByEmail, addUserBooklist } from "@services/dataService";

export async function POST(request) {
  const { userEmail, booklist } = await request.json();
  try {
    const userId = await getUserIdByEmail(userEmail);
    if (userId) {
      const result = await addUserBooklist(userId, booklist);
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
