import React from 'react';
import ConvertToAudioButton from './ConvertToAudioButton';

const ResponseField = ({ response }) => {
  return (
    <div>
      <h2>Response:</h2>
      <textarea
        value={response}
        readOnly
        rows={8}
        cols={100}
        placeholder="The response from the model will appear here..."
      />
      <ConvertToAudioButton response={response} />
    </div>
  );
};

export default ResponseField;
