import * as cheerio from 'cheerio';
import { getCourseByName } from './courses';
import { getExerciseByName } from './exercises';

export const getInvalidNames = async (type: 'courses' | 'exercises', names: string[]) => {
  const idsCheckPromises = names.map(async (name) => {
    const entity = type === 'courses' ? await getCourseByName(name) : await getExerciseByName(name);
    return { name, exists: !!entity };
  });

  const results = await Promise.all(idsCheckPromises);

  return results.filter((result) => !result.exists).map((result) => result.name);
};

export function calculateRank(rating: number): string {
  if (rating >= 6000) return 'S';
  if (rating >= 5000) return 'A+';
  if (rating >= 4300) return 'A';
  if (rating >= 3700) return 'A-';
  if (rating >= 3100) return 'B+';
  if (rating >= 2600) return 'B';
  if (rating >= 2100) return 'B-';
  if (rating >= 1600) return 'C+';
  if (rating >= 1200) return 'C';
  if (rating >= 800) return 'C-';
  if (rating >= 400) return 'D+';
  if (rating >= 200) return 'D';
  return 'D-';
}

export const getDaysUntilDate = (targetDate: Date) => {
  const diffInMs = targetDate.getTime() - new Date().getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
};

export const extractTextFromHTML = (html: string) => {
  const $ = cheerio.load(html);
  let result = '';

  $('body')
    .contents()
    .each((_, el) => {
      if (el.type !== 'tag') return;

      const tag = el.tagName;

      if (tag === 'p') {
        result += $(el).text().trim() + '\n';
      } else if (tag === 'code') {
        result += $(el).text().trim() + '\n\n';
      } else {
        // для прочих элементов, например h2, div и т.п.
        result += $(el).text().trim() + ' ';
      }
    });

  // Финальная очистка: удалить лишние пробелы и пустые строки
  return result
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
