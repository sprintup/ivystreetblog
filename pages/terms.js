import React from "react";
import Layout from "../components/Layout";

const Terms = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to IvyStreet.blog (the "Website"), a platform dedicated to
        fostering the love of reading among children and providing a safe and
        engaging environment for them to explore the world of books.
        The website is aimed at promoting children's literacy and
        encouraging a lifelong love for reading. The website is not a company, 
        but rather an experiement I made to accompany my son's little free library. 
        If it doesn't work out for unforseen reasons, I can just take the website down.
      </p>
      <p className="mb-4">
        The{" "}
        <a
          href="https://github.com/sprintup/ivystreetblog"
          className="text-yellow hover:text-orange"
          target="_blank"
        >
          open source
        </a>{" "}
        Website offers a variety of features and resources, including:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>
          A base booklist of{" "}
          <a
            href="https://github.com/sprintup/ivystreetblog/blob/main/data/books_data.json"
            className="text-yellow hover:text-orange"
            target="_blank"
          >
            1000 children's books
          </a>{" "}
          provided by an{" "}
          <a
            href="https://www.kaggle.com/datasets/modhiibrahimalmannaa/1000-children-books-on-amazom?resource=download"
            className="text-yellow hover:text-orange"
            target="_blank"
          >
            open source dataset
          </a>{" "}
          that can be updated by the community
        </li>
        <li>
          Virtual bookshelves for booklovers to create and manage their booklists, regardless of how they find the book
        </li>
        <li>Open-source book recommendation system to discover new books</li>
        <li>
          User-generated content, such as booklist titles and descriptions
        </li>
        <li>Resources related to children's literature</li>
        <li>
          Offers the opportunity to learn programming through open source
          collaborations primarily through{" "}
          <a
            href="https://docs.github.com/en/get-started/start-your-journey/about-github-and-git"
            className="text-yellow hover:text-orange"
            target="_blank"
          >
            github
          </a>
        </li>
      </ul>
      <p className="mb-4">
        Please note that not all books in user-generated booklists are part of the base collection of children's books. In such cases, the username of the booklist owner will be included in the URL, for instance, /username/booklistname.
      </p>
      <p className="mb-4">
        By accessing or using the Website, you agree to be bound by these Terms
        of Service ("Terms"). If you do not agree to these Terms, please do not
        use the Website.
      </p>
      <h2 className="text-2xl font-bold mb-2">
        Parental Consent and Contact Information
      </h2>
      <p className="mb-4">
        IvyStreet.blog is committed to providing a safe and age-appropriate
        environment for children first. To ensure this, we require parental consent
        and contact information for all users under the age of 18. If a user
        violates these terms, the account may be locked and the parent or guardian 
        may be contacted via the provided contact information.
      </p>
      <p className="mb-4">
        The intent of the username is to keep the user annonymous, while providing
        readers with information about the source of the booklist. (example: think /username/booklist)
        Visiting booklists with recognizable usernames is encouraged (such as a teacher's summer reading 
        list), while unrecognized usernames requires further parental approval. 
      </p>
      <p className="mb-4">
        During the registration process, if the user is under 18, they must have the parent or
        guardian approve the child's account and agree to
        these Terms on their behalf.
      </p>
      <h2 className="text-2xl font-bold mb-2">Use of the Website</h2>
      <p className="mb-4">
        The Website is intended for users of all ages, with a focus on providing
        content and services related to children's books. You agree to use the
        Website only for lawful purposes and in accordance with these Terms.
      </p>
      <h2 className="text-2xl font-bold mb-2">Open Source</h2>
      <p className="mb-4">
        The code for this Website is open source, and you are free to copy,
        modify, and distribute the code in accordance with the applicable
        open-source license. The original website will be accessible 
        via <a
          href="https://github.com/sprintup/ivystreetblog/issues"
          className="text-yellow hover:text-orange"
          target="_blank"
        >https://www.ivystreet.blog/</a> (note: might redirect)
      </p>
      <h2 className="text-2xl font-bold mb-2">User-Generated Content</h2>
      <p className="mb-4">
        The Website may allow users to post, submit, or transmit content, such
        as booklist titles and descriptions that might include book reviews, ratings and comments. 
        By posting or submitting content to the Website, you grant
        IvyStreet.blog a non-exclusive, royalty-free, perpetual, irrevocable,
        and fully sublicensable right to use, reproduce, modify, adapt, publish,
        translate, create derivative works from, distribute, and display such
        content throughout the world in any media.
      </p>
      <h2 className="text-2xl font-bold mb-2">Third-Party Links</h2>
      <p className="mb-4">
        The Website may contain links to third-party websites or resources.
        These links are provided for your convenience only. IvyStreet.blog has
        no control over the content of those websites and is not responsible for
        their availability or accuracy. IvyStreet.blog does not endorse or
        guarantee the accuracy, completeness, or usefulness of any information
        provided by third-party websites.
      </p>
      <h2 className="text-2xl font-bold mb-2">Disclaimer of Warranties</h2>
      <p className="mb-4">
        The Website is provided on an "as is" and "as available" basis, without
        warranties of any kind, either express or implied. IvyStreet.blog does
        not warrant that the Website will be uninterrupted, error-free, or free
        from viruses or other harmful components.
      </p>
      <h2 className="text-2xl font-bold mb-2">Limitation of Liability</h2>
      <p className="mb-4">
        In no event shall IvyStreet.blog be liable for any direct, indirect,
        incidental, consequential, or punitive damages arising out of or in
        connection with the use of the Website or the content, products, or
        services provided through the Website.
      </p>
      <h2 className="text-2xl font-bold mb-2">Termination of Accounts</h2>
      <p className="mb-4">
        IvyStreet.blog reserves the right to terminate any user account for any
        reason, at its sole discretion. This includes, but is not limited to,
        violations of these Terms, unauthorized use of the Website, or any other
        conduct that IvyStreet.blog deems inappropriate or harmful to the
        Website or its users. 
      </p>
      <h2 className="text-2xl font-bold mb-2">Intellectual Property</h2>
      <p className="mb-4">
        All content on the Website, including but not limited to text, graphics,
        logos, images, and software, is the property of IvyStreet.blog and
        protected by applicable copyright and trademark laws.
      </p>
      <h2 className="text-2xl font-bold mb-2">Modifications to the Terms</h2>
      <p className="mb-4">
        IvyStreet.blog reserves the right to modify these Terms at any time. Any
        changes will be effective immediately upon posting the revised Terms on
        the Website.
      </p>
      <p>
        If you have any questions about these Terms, please contact me on
        <a
          href="https://github.com/sprintup/ivystreetblog/issues"
          className="text-yellow hover:text-orange"
          target="_blank"
        > Github</a> or <a
        href="https://www.linkedin.com/in/stephenprintup/"
        className="text-yellow hover:text-orange"
        target="_blank"
      >Linkedin</a> or just knock on my door if you live in the neighborhood. 
      </p>
      <p className="mt-4">Last updated: 3.16.2024</p>
    </Layout>
  );
};

export default Terms;
