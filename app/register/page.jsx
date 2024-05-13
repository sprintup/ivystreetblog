"use client";
// app/register/page.jsx

import { useState } from "react";

export default function RegisterPage() {
  const [activeAccordion, setActiveAccordion] = useState("github");

  const toggleAccordion = (accordion) => {
    setActiveAccordion(activeAccordion === accordion ? "" : accordion);
  };

  return (
    <div className="flex items-start justify-center bg-primary py-8">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-4xl mx-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="w-full md:w-2/3">
            <h2 className="text-3xl text-accent mb-6">Register</h2>
            <div className="space-y-4">
              {/* GitHub Account */}
              <div>
                <button
                  className="w-full text-left focus:outline-none"
                  onClick={() => toggleAccordion("github")}
                >
                  <h3 className="text-xl font-bold text-accent text-yellow hover:text-orange">
                    GitHub Account
                  </h3>
                </button>
                <div
                  className={`mt-2 ${
                    activeAccordion === "github" ? "block" : "hidden"
                  }`}
                >
                  <p className="text-accent">
                    To register for an account, please follow these steps:
                  </p>
                  <ol className="text-accent list-decimal list-inside mt-4">
                    <li>
                      Sign up for a GitHub account at{" "}
                      <a
                        href="https://github.com/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow hover:text-orange"
                      >
                        https://github.com/signup
                      </a>
                    </li>
                    <li>
                      Once you have a GitHub account, log in to our website
                      using the GitHub authentication by clicking the button on
                      the right.
                    </li>
                  </ol>
                  <p className="text-accent mt-4">
                    If you already have a GitHub account, you can go straight to
                    login by clicking the button on the right.
                  </p>
                </div>
              </div>

              {/* Passkeys */}
              <div>
                <button
                  className="w-full text-left focus:outline-none "
                  onClick={() => toggleAccordion("passkeys")}
                >
                  <h3 className="text-xl font-bold text-accent text-yellow hover:text-orange">
                    Setting up Passkeys
                  </h3>
                </button>
                <div
                  className={`mt-2 ${
                    activeAccordion === "passkeys" ? "block" : "hidden"
                  }`}
                >
                  <p className="text-accent">
                    <a
                      href="https://webauthn.guide/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow hover:text-orange"
                    >
                      Webauthn
                    </a>{" "}
                    is a modern way to authenticate that doesn't require a
                    password, but requires the user to register their device
                    with the authentication provider, in this case GitHub. Once
                    their device is registered, they will be able to log in
                    using their device's built-in mechanism, such as Face ID.
                  </p>
                  <p className="text-accent">
                    Since this website will most likely be accessed from a
                    phone, it makes sense to use this method of authentication.
                  </p>
                  <p className="text-accent mt-4">
                    To register their device, they must visit{" "}
                    <a
                      href="https://github.com/settings/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow hover:text-orange"
                    >
                      https://github.com/settings/security
                    </a>{" "}
                    after registering for your Github account and clicking 'Add
                    a passkey'. Please make sure your device screen is unlocked
                    prior to scanning the QR code to register your device with
                    GitHub.
                  </p>
                  <p className="text-accent mt-4">
                    The initial attempt might require enabling passkeys on your
                    device and choosing where you want to store your passkeys.
                    Once these selections are made, the user can restart the
                    'Add a passkey' process and that should allow you to
                    complete successfully.
                  </p>
                  <p className="text-accent mt-4">
                    For more information, please visit{" "}
                    <a
                      href="https://fidoalliance.org/passkeys/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow hover:text-orange"
                    >
                      https://fidoalliance.org/passkeys/
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Add to Home Screen */}
              <div>
                <button
                  className="w-full text-left focus:outline-none"
                  onClick={() => toggleAccordion("homescreen")}
                >
                  <h3 className="text-xl font-bold text-accent text-yellow hover:text-orange">
                    Add to Home Screen
                  </h3>
                </button>
                <div
                  className={`mt-2 ${
                    activeAccordion === "homescreen" ? "block" : "hidden"
                  }`}
                >
                  <p className="text-accent">
                    You can add the website as an icon on your home screen for
                    quick access. Here's how:
                  </p>
                  <ul className="text-accent list-disc list-inside mt-4">
                    <li>
                      On iOS: Open Safari, navigate to the website, and select
                      'Add to Home Screen'.
                    </li>
                    <li>
                      On Android: Open Chrome, navigate to the website, and
                      select 'Add to Home Screen'.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Parental Approval */}
              <div>
                <button
                  className="w-full text-left focus:outline-none"
                  onClick={() => toggleAccordion("parental")}
                >
                  <h3 className="text-xl font-bold text-accent text-yellow hover:text-orange">
                    Attention Minors: Parent/Guardian Approval Required
                  </h3>
                </button>
                <div
                  className={`mt-2 ${
                    activeAccordion === "parental" ? "block" : "hidden"
                  }`}
                >
                  <p className="text-accent">
                    If you are under 18 years old, you must have your parent or
                    guardian complete the registration process on your behalf
                    using their own GitHub account. Your parent or guardian will
                    be solely responsible for reviewing and accepting the terms
                    of use.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="mt-8 md:mt-0 md:ml-8">
            <a
              href="/api/auth/signin"
              className="block w-full md:w-auto bg-yellow text-primary text-center font-bold py-2 px-4 rounded-md hover:bg-orange transition duration-300"
            >
              Log in with GitHub
            </a>
            <p className="text-accent text-sm mt-4">
              By registering, you agree to our{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow hover:text-orange"
              >
                terms of use
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
