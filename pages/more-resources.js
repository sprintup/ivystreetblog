import React from 'react';

const MoreResources = () => {
  // Placeholder for resources
  const resources = [];

  return (
    <div>
      <h1>More Resources</h1>
      <ul>
        {resources.map((resource, index) => (
          <li key={index}>{resource}</li>
        ))}
      </ul>
    </div>
  );
};

export default MoreResources;