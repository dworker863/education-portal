'use client';

import React, { FC, useState, useTransition } from 'react';
import { useChannel, useConnectionStateListener } from 'ably/react';
import type { Message } from 'ably';
import { Button } from './button';
import { cn } from '../libs/cn';

type TChat = {
  showChat?: boolean;
};

const Chat: FC<TChat> = ({ showChat }) => {
  const [isPending, startTransiton] = useTransition();

  const [messages, setMessages] = useState<Message[]>([]);

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  const { channel } = useChannel('get-started', 'first', (message) => {
    setMessages((previousMessages) => [...previousMessages, message]);
  });

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div
      className={cn(
        'flex flex-col w-svw space-y-4 p-5 rounded-lg bg-primary shadow-md absolute bottom-0 left-full -z-10 px-12 py-5 transition-transform duration-500 ease-in-out transform',
        { '-translate-x-full': showChat },
      )}
    >
      <div className="max-h-[200px] py-1 overflow-y-hidden">
        {messages.map((message) => {
          return <p key={message.id}>{message.data}</p>;
        })}
      </div>
      <div className="flex justify-center">
        <Button
          className="w-[50%]"
          variant="custom"
          type="submit"
          disabled={isPending}
          onClick={() => {
            startTransiton(() => {
              channel.publish('first', 'Here is my first message!');
            });
          }}
        >
          Отправить сообщение
        </Button>
      </div>
    </div>
  );
};

export default Chat;
