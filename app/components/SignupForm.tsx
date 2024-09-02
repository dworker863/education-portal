'use client';

import { FormEvent } from 'react';
import { registration } from '../libs/server-actions';
import { useRouter } from 'next/navigation';

const SignupForm = () => {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const user = await registration(formData);

    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="username">Username</label>
        <br />
        <input id="username" type="text" name="username" />
      </fieldset>
      <fieldset>
        <label htmlFor="email">Email</label>
        <br />
        <input id="email" type="text" name="email" />
      </fieldset>
      <fieldset>
        <label htmlFor="password">Password</label>
        <br />
        <input id="password" type="text" name="password" />
      </fieldset>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
