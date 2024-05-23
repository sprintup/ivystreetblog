// app/accordionContent.js

export const githubContent = (
    <>
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
                using the GitHub authentication by <a
                    href='/api/auth/signin?callbackUrl=/my-bookshelf'
                    className="text-yellow hover:text-orange focus:text-orange py-2 rounded-md font-medium"
                >clicking here to login</a>.
            </li>
        </ol>
        <p className="text-accent mt-4">
            If you already have a GitHub account, you can go straight to
            login by clicking the button on the right.
        </p>
    </>
);

export const whyGithubContent = (
    <>
        <p className="text-accent">
            Using GitHub as an authentication provider allows us to offload some of
            the complicated, repetitive, and error-prone operations like resetting
            passwords, verifying emails to reduce spam, implementing transactional
            emails, and securely storing password hashes. IvyStreetBlog does not store
            password hashes, nor has access to password hashes as part of the
            information provided by GitHub. The way we determine you are who you say
            you are is by obtaining the email you provide GitHub (after they determine
            it is valid) and using that email to create an account on our website.
            Since the email you provide to GitHub might be different than the email
            other providers have registered, like Gmail, we've chosen to provide
            GitHub as the only authentication provider at this time.
        </p>
        <p className="text-accent mt-4">
            The sign-up process is easy and free. Also, there are built-in tools in
            GitHub that will let us make this website better, such as issue tracking.
            So if you have any problems with this site or suggestions, feel free to
            submit your bug report or feature request in the form of an issue located{" "}
            <a
                href={`${process.env.NEXT_PUBLIC_GITHUB_REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow hover:text-orange"
            >
                here
            </a>
            . Please include relevant details to help us understand and resolve the
            issue or implement the feature request.
        </p>
        <p className="text-accent mt-4">
            Please note that changing emails in GitHub will result in getting a
            duplicate account created in IvyStreetBlog, so try to use only one email
            with GitHub if at all possible.
        </p>
    </>
);

export const submitIssuesContent = (
    <>
        <p className="text-accent">
            If you encounter any bugs or have suggestions for new features, we
            encourage you to submit them through our GitHub repository's issue
            tracker. This allows us to keep track of reported issues and feature
            requests, prioritize them, and work on addressing them in a structured
            manner.
        </p>
        <ol className="text-accent list-decimal list-inside mt-4">
            <li>
                To submit a bug report or feature request, visit our GitHub repository
                at{" "}
                <a
                    href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow hover:text-orange"
                >
                    {process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
                </a>
                .
            </li>
            <li>
                Click on the "Issues" tab, and then click on the "New Issue" button.
            </li>
            <li>
                Choose the appropriate issue template (e.g., "Bug Report" or "Feature
                Request") and fill out the required information as detailed as
                possible.
            </li>
            <li>
                For bug reports, please provide steps to reproduce the issue, any
                error messages you receive, and any other relevant information that
                could help us diagnose and fix the problem.
            </li>
            <li>
                For feature requests, please describe the proposed feature, why you
                think it would be beneficial, and any additional details or use cases
                that could help us understand and implement the feature.
            </li>
        </ol>
        <p className="text-accent mt-4">
            By submitting issues through our GitHub repository, you'll help us
            improve the platform and provide a better experience for all users.
            We appreciate your feedback and contributions to making IvyStreetBlog
            even better.
        </p>
    </>
);

export const collaborateOnGitHubContent = (
    <>
        <p className="text-accent">
            We welcome contributions from the community to help improve IvyStreetBlog.
            If you're familiar with GitHub and would like to contribute code changes,
            you can do so by submitting a pull request.
        </p>
        <ol className="text-accent list-decimal list-inside mt-4">
            <li>
                Fork the{" "}
                <a
                    href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow hover:text-orange"
                >
                    IvyStreetBlog repository
                </a>{" "}
                to your own GitHub account.
            </li>
            <li>
                Clone your forked repository to your local machine using Git.
            </li>
            <li>
                Create a new branch for your changes, following the Git branching model
                of your choice.
            </li>
            <li>
                Make your desired changes to the codebase, ensuring that your code
                follows best practices and is well-documented.
            </li>
            <li>
                Commit your changes to your local branch and push them to your forked
                repository on GitHub.
            </li>
            <li>
                From your forked repository on GitHub, open a new pull request to merge
                your changes into the main IvyStreetBlog repository.
            </li>
            <li>
                Provide a clear and concise description of your changes, including any
                relevant issue numbers or references.
            </li>
        </ol>
        <p className="text-accent mt-4">
            Our team will review your pull request, provide feedback if necessary, and
            merge it into the main codebase if it meets our contribution guidelines.
            We appreciate your contributions and look forward to collaborating with
            you to make IvyStreetBlog even better.
        </p>
    </>
);

export const useForOwnLibraryContent = (
    <>
        <p className="text-accent">
            IvyStreetBlog is an open-source project, which means that the codebase is
            freely available for anyone to use, modify, and distribute for their own
            purposes. If you're running your own free little library and would like to
            use IvyStreetBlog as a companion website, you're welcome to do so.
        </p>
        <ol className="text-accent list-decimal list-inside mt-4">
            <li>
                Fork the{" "}
                <a
                    href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow hover:text-orange"
                >
                    IvyStreetBlog repository
                </a>{" "}
                to your own GitHub account.
            </li>
            <li>
                Clone your forked repository to your local machine using Git.
            </li>
            <li>
                Modify the codebase as needed to fit your specific requirements, such
                as changing the branding, styling, or functionality.
            </li>
            <li>
                Deploy the modified codebase to a hosting platform of your choice, such
                as Vercel, Netlify, or your own server.
            </li>
            <li>
                Customize the deployed website to match the branding and information
                specific to your free little library.
            </li>
        </ol>
        <p className="text-accent mt-4">
            By using IvyStreetBlog as a starting point, you'll have a solid foundation
            for creating a companion website for your free little library, allowing
            you to share information, manage book collections, and engage with your
            community. Feel free to modify the codebase as needed, and don't hesitate
            to contribute any improvements or bug fixes back to the main IvyStreetBlog
            repository.
        </p>
    </>
);

export const passkeysContent = (
    <>
        <p className="text-accent">
            <a
                href="https://webauthn.guide/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow hover:text-orange"
            >
                Webauthn
            </a>{" "}
            is a modern way to authenticate that doesn't require a password, but requires you to register your device with the authentication provider, in this case GitHub. Once your device is registered, you will be able to log in using your device's built-in mechanism, such as Face ID.
        </p>
        <p className="text-accent mt-4">
            Since this website will most likely be accessed from a phone, it makes sense to use this method of authentication. Registering your device is optional, but recommended, since otherwise you’ll need to remember the password every time you want to log in.
        </p>
        <p className="text-accent mt-4">
            To register your device, visit{" "}
            <a
                href="https://github.com/settings/security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow hover:text-orange"
            >
                https://github.com/settings/security
            </a>{" "}
            (on a desktop) after registering for your Github account and clicking 'Add a passkey'. Please make sure your device screen is unlocked prior to scanning the QR code to register your device with GitHub.
        </p>
        <p className="text-accent mt-4">
            The initial attempt might require enabling passkeys on your device and choosing where you want to store your passkeys. Once these selections are made, the user can restart the 'Add a passkey' process and that should allow you to complete successfully.
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
    </>
);

export const homeScreenContent = (
    <>
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
    </>
);

export const parentalContent = (
    <>
        <p className="text-accent">
            If you are under 18 years old, you must have your parent or
            guardian complete the registration process on your behalf
            using their own GitHub account. Your parent or guardian will
            be solely responsible for reviewing and accepting the terms
            of use.
        </p>
    </>
);