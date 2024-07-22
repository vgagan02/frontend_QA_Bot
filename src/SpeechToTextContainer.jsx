import React, { useState, useRef } from 'react';
import InputField from './InputField';
import ListenButton from './ListenButton';
import SubmitButton from './SubmitButton';
import ResponseField from './ResponseField';

const SpeechToTextContainer = ({ apiKey1 }) => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [response, setResponse] = useState('');
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startListening = async () => {
    if (!listening) {
      setListening(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          alert('Browser not supported');
          return;
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        const socket = new WebSocket(`wss://api.deepgram.com/v1/listen`, ['token', apiKey1]);

        socket.onopen = () => {
          mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data);
            }
          });
          mediaRecorder.start(1000);
        };

        socket.onmessage = (message) => {
          const received = JSON.parse(message.data);
          const newTranscript = received.channel.alternatives[0].transcript;
          if (newTranscript && received.is_final) {
            setTranscript((prev) => prev + newTranscript + ' ');
          }
        };

        socket.onclose = () => {
          console.log('WebSocket closed');
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        socketRef.current = socket;
        mediaRecorderRef.current = mediaRecorder;
      } catch (error) {
        console.error('Error accessing microphone or setting up WebSocket:', error);
      }
    } else {
      setListening(false);
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (socketRef.current) socketRef.current.close();
    }
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) return;

    try {
      const response = await fetch('https://botbackend-rosy.vercel.app/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: transcript }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data.answer);
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Speech to Text</h1>
      <InputField transcript={transcript} setTranscript={setTranscript} />
      <ListenButton listening={listening} onClick={startListening} />
      <SubmitButton onClick={handleSubmit} />
      <ResponseField response={response} />
    </div>
  );
};

export default SpeechToTextContainer;
