// components/AccordionWrapper.jsx

import React from 'react';

const AccordionWrapper = ({ title, children }) => {
  return (
    <details className='mb-4'>
      <summary className='text-yellow hover:text-orange cursor-pointer'>
        {title}
      </summary>
      <div className='my-2 bg-secondary p-4 rounded-md'>{children}</div>
    </details>
  );
};

export default AccordionWrapper;
