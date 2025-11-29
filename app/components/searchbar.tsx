import React, { useEffect, useState } from 'react';
import { IIndexCourse, IIndexExercise } from '../libs/interfaces/interfaces';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setResults(null);
        return;
      }

      setLoading(true);
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="relative w-full max-w-xl">
      <input
        className="border p-2 rounded w-[500px] h-[35px] bg-customBlock"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Поиск курсов, упражнений, слов..."
      />
      <FaSearch className="absolute right-2 top-2 cursor-pointer text-customSecondary" />
      {loading && (
        <div className="absolute bg-customBlock p-4 shadow rounded">
          Ищем...
        </div>
      )}

      {results && (
        <div className="absolute bg-customBlock p-4 shadow rounded w-full max-h-96 overflow-y-auto text-sm">
          <h4 className="font-semibold text-customSecondary">Курсы</h4>
          {results.courses.map((course: IIndexCourse) => (
            <p key={course.id}>{course?.name}</p>
          ))}

          <h4 className="font-semibold mt-2 text-customSecondary">
            Упражнения
          </h4>
          {results.exercises.map((exercise: IIndexExercise) => (
            <p key={exercise.id}>{exercise?.name}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
