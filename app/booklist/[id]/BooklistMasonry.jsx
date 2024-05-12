// app/booklist/[id]/BooklistMasonry.jsx

"use client";

import React from "react";
import Masonry from "react-masonry-css";
import BookDetailsPublic from "./BookDetailsPublic";
import AddToReadingListButton from "@components/AddToReadingListButton";
import { useSession } from "next-auth/react";
import "./BooklistMasonry.css";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function BooklistMasonry({ booklist }) {
  const { data: session } = useSession();

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {booklist.books.map((book) => (
        <div key={book._id}>
          <BookDetailsPublic book={book} />
          {session && <AddToReadingListButton book={book} />}
        </div>
      ))}
    </Masonry>
  );
}
