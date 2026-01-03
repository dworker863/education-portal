import React, { FC } from 'react';

type TCodePrewiexProps = {
  html?: string;
  css?: string;
};

const CodePrewiex: FC<TCodePrewiexProps> = ({ html, css }) => {
  const srcDoc = `
<!DOCTYPE html>
<html>
<head>
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>
`;

  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <div className="bg-black text-white text-sm px-3 py-1">Preview</div>
      <iframe
        className="w-full h-64 bg-white"
        sandbox="allow-scripts"
        srcDoc={srcDoc}
      />
    </div>
  );
};

export default CodePrewiex;
