import React, { useEffect, useState } from 'react';

function Websocket() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (event) => {
      setMessage(event.data);
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <h1>WebSocket Demo</h1>
      <p>{message}</p>
    </div>
  );
}

export default Websocket;