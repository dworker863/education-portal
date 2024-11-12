'use client';

import ErrorMessage from '@/app/components/error-message';
import SuccessMessage from '@/app/components/success-message';
import { confirmVerification } from '@/app/libs/server-actions/auth-actions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      confirmVerification(token)
        .then((data) => {
          if (data?.success) {
            setError('');
            setSuccess(data?.success);
          }
        })
        .catch((error) => {
          setSuccess('');
          setError(error.message);
        });
    } else {
      setSuccess('');
      setError('Wrong token');
    }
  }, [token, error, success]);

  return (
    <div className="flex justify-center items-center h-screen">
      {success && <SuccessMessage message={success} />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
