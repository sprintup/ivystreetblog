// app/api/user/profile/route.js

import { ReadUserEditProfileInteractor } from "@/interactors/profile/ReadUserEditProfileInteractor";
import { UpdateUserProfileInteractor } from "@/interactors/profile/UpdateUserProfileInteractor";

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  try {
    const readUserProfileInteractor = await ReadUserEditProfileInteractor.create();
    const userProfile = await readUserProfileInteractor.execute(email);
    return new Response(JSON.stringify(userProfile), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  const { email, publicProfileName } = await request.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  try {
    const updateUserProfileInteractor = await UpdateUserProfileInteractor.create();
    const updatedUser = await updateUserProfileInteractor.execute(email, publicProfileName);

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
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