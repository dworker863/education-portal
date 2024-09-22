import { prisma } from '@/prisma/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const fileUpload = async (file: File) => {
  if (!file || file.size === 0) {
    return new Error('No file uploaded');
  }

  try {
    const data = await file.arrayBuffer();
    const uploadPath = path.resolve('public/uploads', file.name);

    await fs.writeFile(uploadPath, Buffer.from(data));

    console.log('File successfully uploaded');

    return path.join('/uploads', file.name);
  } catch (error) {
    console.error(error);

    throw error;
  }
};
