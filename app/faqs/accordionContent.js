// app/accordionContent.js
import Link from 'next/link';

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

export const whatIsABooklistContent = (
    <>
        <p className="text-accent">
            Booklists are a way to share unique and insightful perspectives with others. A booklist is simply a list of books that you add from your collection. The key point is that the book must have made some impact on you, and that's why you remembered it and recommend it to others.
        </p>
        <p className="text-accent mt-4">
            A booklist is a collection of these books that are united by some theme, event, or idea. Use the booklist description to describe who the booklist is for generally (remember, no personally identifiable information), like anyone interested in learning about poetry or a certain theory or genre.
        </p>
    </>
);

export const whatIsACollectionContent = (
    <>
        <p className="text-accent">
            A collection is your personal collection of books, which can be added to one or many booklists. A book can exist in the collection without being added to any booklists, but you would be able to put it in your reading list.
        </p>
        <p className="text-accent mt-4">
            A book can be added to the collection from several places, but it's important to remember that adding a book to the collection does not automatically add it to the booklist or reading list. Once a book is in your collection, you can add the book into whichever booklist you'd like or add the book to your reading list.
        </p>
        <p className="text-accent mt-4">
            To add more details than title and author, you must go to 'My Collection'. This is where you can delete or archive books as well.
        </p>
    </>
);

export const privateBooklistContent = (
    <>
        <p className="text-accent">
            When a booklist is marked as private, other users will not be able to find it on the public bookshelf. It's basically an 'off switch' for the booklist while you're curating the booklist. When you're ready for the booklist to appear on the public bookshelf, you can make the booklist visible for others to see.
        </p>
        <p className="text-accent mt-4">
            When a user views the booklist full of books on the public bookshelf, they can add any of the books to their reading lists or add any of the books to any of their own booklists.
        </p>
        <p className="text-accent mt-4">
            Private reading lists are perfect for curating a list of books to put on hold at the library, where the librarians will find them for you and collect them all for you to pick up.
        </p>
    </>
);

export const makeBooklistPublicContent = (
    <>
        <p className="text-accent">
            A few things happen when you have a public booklist.
        </p>
        <p className="text-accent mt-4">
            First, when a user navigates to your public booklist page (at a URL that looks something like baseUrl/public-bookshelf/public-booklist/66385c63205c1f4ab1c9f3e2), they will be able to see all of the books you've added to that booklist and will be able to add those books to their reading list or their booklists. Your public booklist will be accessible to anyone, including those without an account.
        </p>
        <p className="text-accent mt-4">
            Second, your public profile name becomes part of the URL that people can use to view all of your public booklists. Users are able to browse your other public booklists by pressing your public profile name on the public booklist page.
        </p>
        <p className="text-accent mt-4">
            Third, you're able to share your public booklist with anyone, including people without an account. There is a share button where you can even print a QR code that can be made into a sticker or something. You can text and email the link to the public booklist.
        </p>
    </>
);

export const whyAmazonLinksContent = (
    <>
        <p className="text-accent">
            Currently, there is a way to populate the book's picture if you use an Amazon link. This avoids the complications with uploading images. This is optional, please include any bookstore link you'd like.
        </p>
    </>
);

export const deleteArchiveBookContent = (
    <>
        <p className="text-accent">
            Deleting a book from your collection will also delete it from all booklists and other people's reading lists.
        </p>
        <p className="text-accent mt-4">
            If you want to move the book out of your collection but keep it available on other users' reading lists and booklists, you can choose to archive the book instead.
        </p>
    </>
);

export const whatIsBookshelfContent = (
    <>
        <p className="text-accent">
            A bookshelf is a collection of booklists. There is a 'public bookshelf', which is comprised of all the public booklists of all the users, and 'my bookshelf'. The public bookshelf can be accessed through the link in the footer, while 'my bookshelf' is only accessible to the authorized user after logging in.
        </p>
        <p className="text-accent mt-4">
            'My Bookshelf' is a place to create and maintain both public and private booklists.
        </p>
    </>
);

export const whatIsReadingListContent = (
    <>
        <p className="text-accent">
            A reading list is a list of books you've marked as 'to read' by simply adding them to your reading list. It's a private book tracker in case you find a book that you quickly just want to read. You can add books to the reading list directly from your collection or any booklist, including others' public booklists.
        </p>
        <p className="text-accent mt-4">
            Once you read the book, you can mark the book as 'finished' and then you have the opportunity to write a review. Reviews are only visible to you and are a way of keeping track of what you thought of the book.
        </p>
        <p className="text-accent mt-4">
            Removing a book from the reading list only removes it from your reading list and not the collection or other booklists. Howevever, removing a book from the reading list will remove any review you've written for that book.
        </p>
    </>
);

export const whatIsProfileContent = (
    <>
        <p className="text-accent">
            The public profile name will be included as the base path of the URL to your public bookshelf. For instance, if you set it to 'example-profile-name' then the URL that would show your public bookshelf would be something like 'baseUrl/example-profile-name'.
        </p>
        <p className="text-accent mt-4">
            Others will see the public profile name on any of your public booklists and can click it to get to your public bookshelf.
        </p>
        <p className="text-accent mt-4">
            The public profile name should be a sort of secret code that has no personally identifiable information. It can be a superhero, a character in a novel, or just something random. The idea is to keep your identity private while still allowing others to access your public booklists.
        </p>
    </>
);

export const thisIsPublicBooklistContent = (
    <>
        <p className="text-accent">
            This is a public booklist. A public booklist is a curated list of books that the owner has chosen to share with the world. Anyone can view the books in a public booklist, but you need to log in to be able to add them to your reading list or add them to your own booklists. Sign up is fast, free, and easy.
        </p>
        <p className="text-accent mt-4">
            Public booklists are a great way to discover new books and get recommendations from others who share your interests. You can{' '}
            <Link href="/public-bookshelf" className="text-yellow hover:text-orange">
                browse the public bookshelf
            </Link>{' '}
            or even the curator's public profile name.
        </p>
        <p className="text-accent mt-4">
            Once you're logged in, simply click the "Add to Reading List" button to save it for later. You can also click the "Add to Booklist" button to add the book to one of your own booklists, making it easy to organize and share your own curated booklist.
        </p>
        <p className="text-accent mt-4">
            You can use the share button to share this booklist several ways, including by text, email, or a QR code that can be made into a sticker or something.
        </p>
    </>
);

export const whatIsIvyStreetBlogContent = (
    <>
        <p className="text-accent">
            The Ivy Street Blog is a community-driven platform dedicated to sharing and discovering book recommendations. It's a place where book lovers can curate and share their own booklists, browse public booklists created by others, and find inspiration for their next great read.
        </p>
        <p className="text-accent mt-4">
            At its core, the Ivy Street Blog is powered by the passion and knowledge of its users. Whether you're an avid reader, a librarian, a teacher, or simply someone who enjoys sharing their love of books, you can contribute to the community by creating and sharing your own booklists.
        </p>
        <p className="text-accent mt-4">
            One of the unique features of the Ivy Street Blog is the ability to create and share public booklists. These curated lists of books can be organized around any theme or topic you choose, allowing you to share your literary discoveries and recommendations with others who share your interests.
        </p>
        <p className="text-accent mt-4">
            In addition to creating and sharing booklists, you can also{' '}
            <Link href="/public-bookshelf" className="text-yellow hover:text-orange">
                browse the public bookshelf
            </Link>{' '}
            to discover new books and booklists created by others in the community. You can search by the curator's public profile name, making it easy to find booklists that align with your reading preferences.
        </p>
    </>
);

export const whatIsPublicBookshelfContent = (
    <>
        <p className="text-accent">
            The public bookshelf is a central hub where you can explore and discover public booklists created by members of the Ivy Street Blog community. It's a treasure trove of curated book recommendations, organized in booklists centered on a specific genre, topic. You can even browse the the curator's other public booklists by clicking their public profile name.
        </p>
        <p className="text-accent mt-4">
            Whether you're looking for new books to add to your reading list, seeking inspiration for your next booklist, or simply want to browse the diverse literary tastes of the community, the public bookshelf is the perfect starting point.
        </p>
        <p className="text-accent mt-4">
            Once you find a booklist that catches your eye, you can explore the individual books it contains. If a book piques your interest, you can easily add it to your reading list or one of your own booklists with just a few clicks, making it a seamless experience to discover and organize your next literary adventure.
        </p>
    </>
);

export const whatIsRecommendationContent = (
    <>
        <p className="text-accent">
            The owner of a booklist has the ability to open their booklist to recommendations. This means other users can recommend books from their collection to the booklist. Then the user who owns the booklist that received the recommendation can either accept or reject that recommendation.
        </p>
        <p className="text-accent mt-4">
            When you open the booklist to recommendations, a new tile appears below the list of books on the public booklist page, where anyone might submit recommendations to your booklist. You'll be able to see that your booklist is open for recommendations on the 'My Bookshelf' page, and when someone submits a recommendation, you'll see a link to a page where you can view the recommendation and either accept it or reject it.
        </p>
    </>
);

export const acceptingRecommendationContent = (
    <>
        <p className="text-accent mt-4">
            When you accept a recommendation, you'll have to decide if you want to add their book to your booklist or create a duplicate book from their recommendation in your own collection to add to your booklist. If you just add their recommended book to your booklist, then if they decide to delete that book from their collection, you'll lose that book in your booklist as well. However, if you decide to create a duplicate book in your collection and add it to your booklist, then even if they decide to delete their book, you'll still have a copy of that information.
        </p>
        <p className="text-accent mt-4">
            It's much easier to just add their book to your booklist, as it's not likely people will decide to delete books from their collection over just archiving the books. The downside is that you'll not be able to edit the details of that book, and they will be able to edit the details of the book included in your booklist, giving them a little control over what content is included in your booklist.
        </p>
    </>
);