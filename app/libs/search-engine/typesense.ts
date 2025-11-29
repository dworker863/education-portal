import Typesense from 'typesense';

export const typesense = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz123',
  connectionTimeoutSeconds: 2,
});
