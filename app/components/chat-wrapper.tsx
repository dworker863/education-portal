import { ChannelProvider } from 'ably/react';
import React, { FC, ReactNode } from 'react';

type TChatWrapperProps = {
  channelName: string;
  children: ReactNode;
};

const ChatWrapper: FC<TChatWrapperProps> = ({ channelName, children }) => {
  return <ChannelProvider channelName={channelName}>{children}</ChannelProvider>;
};

export default ChatWrapper;
