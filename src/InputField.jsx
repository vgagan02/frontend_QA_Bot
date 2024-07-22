import React from 'react';
import ClearButton from './ClearButton';

const InputField = ({ transcript, setTranscript }) => {
  const handleClear = () => {
    setTranscript('');
  };

  return (
    <div>
      <textarea
        value={transcript}
        readOnly
        rows={8}
        cols={100}
        placeholder="Your transcribed text will appear here..."
      />
      <ClearButton onClick={handleClear} />
    </div>
  );
};

export default InputField;
