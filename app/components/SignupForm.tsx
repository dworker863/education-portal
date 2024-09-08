'use client';

import { FormEvent, useState } from 'react';
import { registration } from '../libs/server-actions';
import { useRouter } from 'next/navigation';

const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    registration(formData)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        setError(error.message);
      });

    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="email">Email</label>
        <br />
        <input id="email" type="text" name="email" />
        <fieldset>
          <label htmlFor="name">Username</label>
          <br />
          <input id="name" type="text" name="name" />
        </fieldset>
      </fieldset>
      <fieldset>
        <label htmlFor="password">Password</label>
        <br />
        <input id="password" type="text" name="password" />
      </fieldset>
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
