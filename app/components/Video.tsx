import React, { FC } from 'react';

type TVideoProps = {
  src?: string;
};

const Video: FC<TVideoProps> = ({ src }) => {
  return (
    <video width="320" height="240" controls preload="none">
      <source src={src} type="video/mp4" />
      <track src={src} kind="subtitles" srcLang="en" label="English" />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
