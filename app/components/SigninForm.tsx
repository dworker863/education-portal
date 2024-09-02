'use client';

import { FormEvent } from 'react';
import { login } from '../libs/server-actions';

const SigninForm = () => {
  const handleSubmit = (provider: string, e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    login(provider, formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit.bind(null, 'credentials')}>
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
        <button type="submit">Sign In</button>
      </form>
      <br />
      <br />
      <form onSubmit={handleSubmit.bind(null, 'google')}>
        <button type="submit">Sign In with Google</button>
      </form>
      <form onSubmit={handleSubmit.bind(null, 'github')}>
        <button type="submit">Sign In with Github</button>
      </form>
    </>
  );
};

export default SigninForm;
