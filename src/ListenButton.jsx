import React from 'react';

const ListenButton = ({ listening, onClick }) => {
  return (
    <button onClick={onClick}>
      {listening ? 'Stop' : 'Start'} Listening
    </button>
  );
};

export default ListenButton;
