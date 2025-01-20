'use client';

import ErrorMessage from '@/app/components/error-message';
import SuccessMessage from '@/app/components/success-message';
import { confirmVerification } from '@/app/libs/server-actions/auth-actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (token) {
      confirmVerification(token)
        .then((data) => {
          if (data?.success) {
            setError(null);
            setSuccess(data?.success);
            router.push('/');
          }
        })
        .catch((error) => {
          setSuccess(null);
          setError(error.message);
        });
    } else {
      setSuccess(null);
      setError('Неверный токен');
    }
  }, [token, error, success, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {success && <SuccessMessage message={success} />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
