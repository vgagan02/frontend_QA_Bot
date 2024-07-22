import React, { useRef, useState } from 'react';

const ConvertToAudioButton = ({ response }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef(null);

  const handleConvertToAudio = () => {
    if (!response.trim()) return;

    if (speechRef.current && speechSynthesis.speaking) {
      if (isPlaying) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }
      setIsPlaying(!isPlaying);
    } else {
      speechRef.current = new SpeechSynthesisUtterance(response);
      speechRef.current.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(speechRef.current);
      setIsPlaying(true);
    }
  };

  return (
    <button onClick={handleConvertToAudio}>
      {isPlaying ? 'Pause' : 'Play'} Audio
    </button>
  );
};

export default ConvertToAudioButton;
