'use client';
// app/page.jsx
import Image from 'next/image';

import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main>
      <div className='bg-primary text-white py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl font-bold mb-4'>
            Welcome to Ivy Street, where the joy of reading comes to life!
            🌿📚✨
          </h1>
          <p className='text-xl mb-8'>
            Are you ready to embark on an enchanting adventure through the pages
            of captivating children's books? Look no further, because Ivy Street
            is here to be your guide!
          </p>
          <p className='text-xl mb-8'>
            Fill your virtual bookshelf with booklists of amazing books that can
            be discovered using carefully selected resources. With just a click,
            you can explore the details of each book and find the perfect story
            to ignite your imagination.
          </p>
          <p className='text-xl mb-8'>
            We believe that every child has a story to tell, and we want to hear
            yours! If you know of an amazing children's book that you think
            everyone should read, let us know! We'll add it to our ever-growing
            collection, so other kids can enjoy it too.
          </p>
          <p className='text-xl mb-8'>
            At Ivy Street, you'll have your very own special space to keep track
            of all the incredible books you've read. It's like having a secret
            reading diary that celebrates your journey through the pages.
          </p>
          <p className='text-xl mb-8'>
            But the fun doesn't stop there! We've gathered a treasure trove of
            resources to help you explore the wonderful world of children's
            literature even further. From author interviews to book-related
            activities, we've got everything you need to make reading an
            unforgettable experience.
          </p>
          <p className='text-xl mb-8'>
            Remember, at Ivy Street, we believe that every story has the power
            to change lives, and every child has the potential to become a
            lifelong reader. Join us on this incredible journey, and let's
            unlock the magic of books together!
          </p>
          <p className='text-xl font-bold'>
            Happy reading, adventurers! 📚🌿✨
          </p>
        </div>
      </div>
    </main>
  );
}
