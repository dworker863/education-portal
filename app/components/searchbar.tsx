import React, { useEffect, useState } from 'react';
import { IIndexCourse, IIndexExercise } from '../libs/interfaces/interfaces';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (q.length < 2) {
        setResults(null);
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [q]);

  return (
    <div className="relative w-full max-w-xl">
      <input
        className="border p-2 rounded w-[500px] h-[35px] bg-customBlock"
        value={q}
        onChange={(e) => setQ(e.target.value)}
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
          <h4 className="font-semibold">Курсы</h4>
          {results.courses.map((hit: { document: IIndexCourse }) => (
            <p key={hit.document.id}>{hit.document.name}</p>
          ))}

          <h4 className="font-semibold mt-2">Упражнения</h4>
          {results.exercises.map((hit: { document: IIndexExercise }) => (
            <p key={hit.document.id}>{hit.document.name}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
