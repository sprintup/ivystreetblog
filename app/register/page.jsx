// app/register/page.jsx
export default function RegisterPage() {
  return (
    <div className="flex items-start justify-center bg-primary">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-heading text-accent mb-6 text-center">
          Register
        </h2>
        <div className="mb-6">
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
              Once you have a GitHub account, log in to our website using the
              GitHub authentication by clicking the button below.
            </li>
          </ol>
          <p className="text-accent mt-4">
            By using GitHub as a third-party authentication provider, we
            simplify the registration process and ensure secure access to your
            account. We only use the necessary data provided by GitHub, such as
            your email address, to grant access to your personalized book lists.
            Rest assured that your information is kept confidential and is not
            shared with any other parties.
          </p>
          <p className="text-accent mt-4">
            As an open-source project, we welcome contributions from the
            community. If you're interested in contributing to the development
            of our website, please visit our GitHub repository at{" "}
            <a
              href="https://github.com/sprintup/ivystreetblog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow hover:text-orange"
            >
              https://github.com/sprintup/ivystreetblog
            </a>
            .
          </p>
          <p className="text-accent mt-4">
            <strong>Attention Minors: Parent/Guardian Approval Required</strong>
          </p>
          <p className="text-accent">
            If you are under 18 years old, you must have your parent or guardian
            complete the registration process on your behalf using their own
            GitHub account. Your parent or guardian will be solely responsible
            for reviewing and accepting the terms of use.
          </p>
        </div>
        <a
          href="/api/auth/signin"
          className="block w-full bg-yellow text-primary text-center font-bold py-2 px-4 rounded-md hover:bg-orange transition duration-300"
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
  );
}
