import { FormEvent } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function LoginPage() {
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/profile");
    } else {
      // Handle errors
    }
  }

  return (
    <Layout>
      <div className="flex items-start justify-center bg-primary">
        <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-heading text-accent mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-accent font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-tertiary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-accent font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-tertiary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow text-primary font-bold py-2 px-4 rounded-md hover:bg-orange transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
