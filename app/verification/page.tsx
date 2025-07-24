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
    const handleConfirmVerification = async () => {
      try {
        if (token) {
          const response = await confirmVerification(token);

          setError(null);
          setSuccess(response?.success);
          router.push('/');
        } else {
          setSuccess(null);
          setError('Неверный токен');
        }
      } catch (error) {
        setSuccess(null);
        console.error('Ошибка при выполнении запроса:', error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Что-то пошло не так. Попробуйте снова.');
        }
      }
    };

    handleConfirmVerification();
  }, [token, error, success, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {success && <SuccessMessage message={success} />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
