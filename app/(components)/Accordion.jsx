'use client';
// components/Accordion.jsx

import React, { useState } from 'react';

const Accordion = ({ title, content, isOpenByDefault = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='accordion-item'>
      <button
        className='w-full text-left focus:outline-none'
        onClick={toggleAccordion}
      >
        <h3 className='text-xl font-bold text-accent text-yellow hover:text-orange'>
          {title}
        </h3>
      </button>
      <div className={`mt-2 ${isOpen ? 'block' : 'hidden'}`}>{content}</div>
    </div>
  );
};

export default Accordion;
