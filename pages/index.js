import Head from "next/head";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Children's Books</title>
        <link href="/styles/tailwind.css" rel="stylesheet" />
      </Head>
      {/* <Auth /> */}
      <main>This is the homepage.</main>
    </Layout>
  );
}
