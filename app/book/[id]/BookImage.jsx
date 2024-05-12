// app/book/[id]/BookImage.jsx

"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function BookImage({ link }) {
  const [imageError, setImageError] = useState(false);
  const amazonImageUrl = `https://images-na.ssl-images-amazon.com/images/P/${
    link.split("/dp/")[1]
  }.01._SCMZZZZZZZ_.jpg`;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-48 h-64 relative">
      {!imageError ? (
        <Image
          src={amazonImageUrl}
          alt="Book Cover"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          onError={handleImageError}
        />
      ) : (
        <div className="w-48 h-64 flex items-center justify-center bg-gray-200 rounded-lg">
          <p className="text-center">No image found</p>
        </div>
      )}
    </div>
  );
}
