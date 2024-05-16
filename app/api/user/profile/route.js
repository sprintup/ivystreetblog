// app/api/user/profile/route.js

import { getServerSession } from "next-auth/next";
import { options } from "@auth/options";
import { getUserProfile, updateUserProfile } from "@/interactors/_baseInteractor";

export async function GET(request) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const userProfile = await getUserProfile(session.user.email);
    return new Response(JSON.stringify(userProfile), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
    });
  }
}
export async function PUT(request) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { publicProfileName } = await request.json();
    const updatedProfile = await updateUserProfile(session.user.email, {
      publicProfileName,
    });
    return new Response(JSON.stringify(updatedProfile), { status: 200 });
  } catch (error) {
    if (error.message === "Public profile name is already taken.") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    } else {
      return new Response(JSON.stringify({ error: error.toString() }), {
        status: 500,
      });
    }
  }
}
