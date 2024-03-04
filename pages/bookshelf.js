import React from 'react';

const Bookshelf = () => {
  // Placeholder for resources
  const resources = [];

  return (
    <div>
      <h1>Bookshelf</h1>
      <ul>
        {resources.map((resource, index) => (
          <li key={index}>{resource}</li>
        ))}
      </ul>
    </div>
  );
};

export default Bookshelf;