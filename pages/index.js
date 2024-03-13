import Head from "next/head";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Children's Books</title>
        <link href="/styles/tailwind.css" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png" />
        <link rel="manifest" href="favicon/site.webmanifest" />
        <link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      {/* <Auth /> */}
      <main>
        <div className="bg-primary text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Ivy Street, where the joy of reading comes to life!
              🌿📚✨
            </h1>
            <p className="text-xl mb-8">
              Are you ready to embark on an enchanting adventure through the
              pages of captivating children's books? Look no further, because
              Ivy Street is here to be your guide!
            </p>
            <p className="text-xl mb-8">
              Fill your virtual bookshelf with booklists of amazing books that
              can be discovered using carefully selected resources. With just a
              click, you can explore the details of each book and find the
              perfect story to ignite your imagination.
            </p>
            <p className="text-xl mb-8">
              But wait, there's more! We have a magical open source book
              recommendation system that acts like a friendly librarian, helping
              you find books that you'll absolutely love. It's like having a
              best friend who knows exactly what you'll enjoy reading next!
            </p>
            <p className="text-xl mb-8">
              We believe that every child has a story to tell, and we want to
              hear yours! If you know of an amazing children's book that you
              think everyone should read, let us know! We'll add it to our
              ever-growing collection, so other kids can enjoy it too.
            </p>
            <p className="text-xl mb-8">
              At Ivy Street, you'll have your very own special space to keep
              track of all the incredible books you've read. It's like having a
              secret reading diary that celebrates your journey through the
              pages.
            </p>
            <p className="text-xl mb-8">
              But the fun doesn't stop there! We've gathered a treasure trove of
              resources to help you explore the wonderful world of children's
              literature even further. From author interviews to book-related
              activities, we've got everything you need to make reading an
              unforgettable experience.
            </p>
            <p className="text-xl mb-8">
              Remember, at Ivy Street, we believe that every story has the power
              to change lives, and every child has the potential to become a
              lifelong reader. Join us on this incredible journey, and let's
              unlock the magic of books together!
            </p>
            <p className="text-xl font-bold">
              Happy reading, adventurers! 📚🌿✨
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
