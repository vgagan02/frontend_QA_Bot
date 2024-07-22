import React from 'react';

const ClearButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Clear Input
    </button>
  );
};

export default ClearButton;
