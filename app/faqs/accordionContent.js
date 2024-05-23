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
                using the GitHub authentication by clicking the button on
                the right.
            </li>
        </ol>
        <p className="text-accent mt-4">
            If you already have a GitHub account, you can go straight to
            login by clicking the button on the right.
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
            is a modern way to authenticate that doesn't require a password, but requires the user to register their device with the authentication provider, in this case GitHub. Once their device is registered, they will be able to log in using their device's built-in mechanism, such as Face ID.
        </p>
        <p className="text-accent">
            Since this website will most likely be accessed from a phone, it makes sense to use this method of authentication.
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
            after registering for your Github account and clicking 'Add a passkey'. Please make sure your device screen is unlocked prior to scanning the QR code to register your device with GitHub.
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