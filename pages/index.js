import Head from 'next/head';
// import Auth from '../components/Auth';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Children's Books</title>
        <link href="/styles/tailwind.css" rel="stylesheet" />
      </Head>
      {/* <Auth /> */}
      <main>
        This is the homepage.
      </main>
    </div>
  );
}