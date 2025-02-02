import React from 'react';

const Exercise = ({ params }: { params: { name: string } }) => {
  console.log(params);

  const { name } = params;
  const title = name.replace(/([A-Z])/g, ' $1').trim();

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default Exercise;
