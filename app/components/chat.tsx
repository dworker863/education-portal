'use client';

import React, { FC, useState, useTransition } from 'react';
import { ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';
import type { Message } from 'ably';
import { Button } from './button';
import { cn } from '../libs/cn';

type TChat = {
  showChat?: boolean;
};

const Chat: FC<TChat> = ({ showChat }) => {
  const [isPending, startTransiton] = useTransition();

  const [currentRoom, setCurrentRoom] = useState('main');

  const [mainMessages, setMainMessages] = useState<Message[]>([]);
  const [courseMessages, setCourseMessages] = useState<Message[]>([]);

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  const { channel } = useChannel(currentRoom, 'first', (message) => {
    if (currentRoom === 'main') {
      setMainMessages((previousMessages) => [...previousMessages, message]);
    } else {
      setCourseMessages((previousMessages) => [...previousMessages, message]);
    }
  });

  console.log('Chat:', channel.name);

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div
      className={cn(
        'flex flex-col w-svw space-y-4 p-5 h-[300px] rounded-lg bg-primary shadow-md absolute bottom-0 left-full -z-10 px-12 py-5 transition-transform duration-500 ease-in-out transform',
        { '-translate-x-full': showChat },
      )}
    >
      {/* <ChannelProvider channelName="get-started"> */}
      <div className="flex gap-4">
        <Button
          className="w-[50%]"
          variant="custom"
          onClick={() => {
            setCurrentRoom('main');
          }}
        >
          Общий
        </Button>
        <Button
          className="w-[50%]"
          variant="custom"
          onClick={() => {
            setCurrentRoom('course');
          }}
        >
          Курс
        </Button>
      </div>
      <div className="max-h-[200px] py-1 overflow-y-hidden">
        {currentRoom === 'main'
          ? mainMessages.map((message) => {
              return <p key={message.id}>{message.data}</p>;
            })
          : courseMessages.map((message) => {
              return <p key={message.id}>{message.data}</p>;
            })}
      </div>
      <div className="fixed w-full bottom-0 flex justify-center">
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
      {/* </ChannelProvider> */}
    </div>
  );
};

export default Chat;
