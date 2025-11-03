'use client';

import React, { useState } from 'react';
import { useChannel, useConnectionStateListener } from 'ably/react';
import type { Message } from 'ably';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  const { channel } = useChannel('get-started', 'first', (message) => {
    setMessages((previousMessages) => [...previousMessages, message]);
  });

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div className="flex flex-col bg-white text-black p-4 rounded-lg shadow-md">
      {messages.map((message) => {
        return <p key={message.id}>{message.data}</p>;
      })}
      <button
        onClick={() => {
          channel.publish('first', 'Here is my first message!');
        }}
      >
        Publish
      </button>
    </div>
  );
};

export default Chat;
