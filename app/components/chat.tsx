'use client';

import React, { FC, useContext, useEffect, useRef, useState, useTransition } from 'react';
import { useChannel, useConnectionStateListener } from 'ably/react';
import type { Message } from 'ably';
import { Button } from './button';
import { cn } from '../libs/cn';
import { useSession } from 'next-auth/react';
import { IUserCourseProgressPartial } from '../libs/interfaces/interfaces';
import { ChatRoomContext } from './app-wrapper';

type TChat = {
  showChat?: boolean;
};

const Chat: FC<TChat> = ({ showChat }) => {
  const { currentRoom, setCurrentRoom } = useContext(ChatRoomContext)!;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransiton] = useTransition();
  const session = useSession();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  const { channel } = useChannel(currentRoom, 'first', (message) => {
    setMessages((prevMessages) => {
      const roomMessages = prevMessages[currentRoom] || [];
      return {
        ...prevMessages,
        [currentRoom]: [...roomMessages, message],
      };
    });
  });

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div
      className={cn(
        'flex flex-col w-svw space-y-4 p-5 h-[300px] rounded-lg bg-primary shadow-md absolute bottom-0 left-full -z-10 px-12 py-5 transition-transform duration-500 ease-in-out transform',
        { '-translate-x-full': showChat },
      )}
    >
      {/* <ChannelProvider channelName="get-started"> */}
      <div className="flex gap-5">
        <Button
          className="w-[100px]"
          variant="custom"
          onClick={() => {
            setCurrentRoom('main');
          }}
        >
          Общий
        </Button>
        {session.data?.user.coursesProgress &&
          session.data?.user.coursesProgress.map((courseProgress: IUserCourseProgressPartial) => {
            return (
              <Button
                key={courseProgress.id}
                className="w-[100px]"
                variant="custom"
                onClick={() => {
                  setCurrentRoom(`course-${courseProgress.course?.name}`);
                }}
              >
                {courseProgress.course?.name}
              </Button>
            );
          })}
      </div>
      <div className="max-h-[200px] mb-4 overflow-y-scroll">
        {messages[currentRoom] &&
          messages[currentRoom].length > 0 &&
          messages[currentRoom].map((message) => {
            return (
              <p key={message.id} className="flex gap-2 mb-4 whitespace-pre-wrap ">
                <span className="font-bold text-customSecondary">{session.data?.user?.name}:</span>
                {message.data}
              </p>
            );
          })}

        <div ref={messagesEndRef} />
      </div>
      <div className="absolute w-[90%] bottom-0 flex gap-5">
        <textarea
          className="w-[80%] h-[36px] p-2 rounded-lg text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && message.trim() !== '') {
              if (e.shiftKey) {
                return;
              }

              e.preventDefault();
              startTransiton(() => {
                channel.publish('first', message);
                setMessage('');
              });
            }
          }}
        />
        <Button
          className="w-[20%]"
          variant="custom"
          type="submit"
          disabled={isPending}
          onClick={() => {
            startTransiton(() => {
              channel.publish('first', message);
              setMessage('');
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
