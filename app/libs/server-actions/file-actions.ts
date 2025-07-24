import { promises as fs } from 'fs';
import path from 'path';

export const fileUpload = async (file: File) => {
  try {
    if (!file || file.size === 0) {
      return new Error('No file uploaded');
    }

    const data = await file.arrayBuffer();
    const uploadPath = path.resolve('public/uploads', file.name);

    await fs.writeFile(uploadPath, Buffer.from(data));

    return path.join('/uploads', file.name);
  } catch (error) {
    console.error('Ошибка при записи файла: ', error);
    throw error;
  }
};
