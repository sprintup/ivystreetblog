import React from 'react';

const Resources = () => {
  // Placeholder for resources
  const resources = [];

  return (
    <div>
      <h1>Resources</h1>
      <ul>
        {resources.map((resource, index) => (
          <li key={index}>{resource}</li>
        ))}
      </ul>
    </div>
  );
};

export default Resources;