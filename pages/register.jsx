import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function RegisterPage() {
  const router = useRouter();
  const [isMinor, setIsMinor] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const parentName = formData.get("parentName");
    const parentEmail = formData.get("parentEmail");
    const parentPhone = formData.get("parentPhone");

    const userData = {
      username,
      name,
      email,
      password,
      isMinor,
      parentGuardianInfo: isMinor
        ? {
            name: parentName,
            email: parentEmail,
            phone: parentPhone,
          }
        : null,
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      router.push("/profile");
    } else {
      // Handle errors
    }
  }

  const checkUsernameAvailability = async () => {
    if (usernameInput.trim() === "") {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);

    try {
      const response = await fetch(
        `/api/checkUsername?username=${encodeURIComponent(usernameInput)}`,
      );
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error("Error checking username availability:", error);
      setUsernameAvailable(null);
    }

    setIsCheckingUsername(false);
  };

  return (
    <Layout>
      <div className="flex items-start justify-center bg-primary">
        <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-heading text-accent mb-6 text-center">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-accent font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter a unique username"
                className="w-full px-3 py-2 bg-tertiary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow"
                required
                onChange={(e) => setUsername(e.target.value)}
                onBlur={checkUsernameAvailability}
              />
              {isCheckingUsername && (
                <p className="text-accent text-sm mt-1">
                  Checking username availability...
                </p>
              )}
              {usernameAvailable !== null && (
                <p
                  className={`text-sm mt-1 ${
                    usernameAvailable ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {usernameAvailable
                    ? "Username is available!"
                    : "Username is already taken. Please choose a different one."}
                </p>
              )}
              <p className="text-accent text-sm mt-2">
                Note: Your username will be used to share booklist links and
                should not reveal your personal identity.
              </p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-accent font-bold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                className="w-full px-3 py-2 bg-tertiary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow"
                required
              />
            </div>
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
            <div className="mb-4">
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
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isMinor"
                  id="isMinor"
                  className="form-checkbox h-5 w-5 text-yellow"
                  onChange={(e) => setIsMinor(e.target.checked)}
                />
                <span className="ml-2 text-accent">
                  Are you under 18 years old? (click for yes)
                </span>
              </label>
            </div>
            {isMinor && (
              <>
                <div className="mb-4 bg-tertiary p-4 rounded-md">
                  <p className="text-accent font-bold mb-2">
                    Attention Minors: Parent/Guardian Approval Required
                  </p>
                  <p className="text-accent">
                    If you are under 18 years old, you must have your parent or
                    guardian complete and submit this form on your behalf.
                    Please have them input their contact information below. Your
                    parent or guardian will be solely responsible for reviewing
                    and accepting the terms of use.
                  </p>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="parentName"
                    className="block text-accent font-bold mb-2"
                  >
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    id="parentName"
                    placeholder="Enter parent/guardian name"
                    className="w-full px-3 py-2 bg-tertiary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="parentEmail"
                    className="block text-accent font-bold mb-2"
                  >
                    Parent/Guardian Email
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    id="parentEmail"
                    placeholder="Enter parent/guardian email"
                    className="w-full px-3 py-2 bg-tertiary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="parentPhone"
                    className="block text-accent font-bold mb-2"
                  >
                    Parent/Guardian Phone
                  </label>
                  <input
                    type="tel"
                    name="parentPhone"
                    id="parentPhone"
                    placeholder="Enter parent/guardian phone"
                    className="w-full px-3 py-2 bg-tertiary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-yellow"
                    required
                  />
                </div>
              </>
            )}
            <div className="mb-6">
              <label htmlFor="acceptTerms" className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  className="form-checkbox h-5 w-5 text-yellow"
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                />
                <span className="ml-2 text-accent">
                  I accept the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-yellow hover:text-orange"
                  >
                    terms of use
                  </a>
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow text-primary font-bold py-2 px-4 rounded-md hover:bg-orange transition duration-300"
              disabled={!acceptedTerms}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
