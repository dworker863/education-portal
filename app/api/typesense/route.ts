import { typesense } from '@/app/libs/search-engine/typesense';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await typesense.collections().create({
      name: 'courses',
      fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'tags', type: 'string[]' },
      ],
    });

    await typesense.collections().create({
      name: 'exercises',
      fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'task', type: 'string' },
        { name: 'language', type: 'string' },
        { name: 'tags', type: 'string[]' },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  // try {
  //   // Получаем список всех коллекций
  //   const collections = await typesense.collections().retrieve();

  //   for (const collection of collections) {
  //     console.log(`Удаляем коллекцию: ${collection.name}`);
  //     await typesense.collections(collection.name).delete();
  //   }

  //   console.log('Все коллекции удалены');
  // } catch (error) {
  //   console.error('Ошибка при удалении коллекций:', error);
  // }
}
