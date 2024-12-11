'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';

const Spinner = () => {
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log(pathname);

    startTransition(() => {
      setLoading(true);
    });

    setTimeout(() => {
      setLoading(false); // Завершаем загрузку сразу после смены маршрута
    }, 500);
  }, [pathname]);

  return loading || isPending ? (
    <div className="spinner-wrapper">
      <div className="dizzy-gillespie"></div>
    </div>
  ) : null;
};

export default Spinner;
