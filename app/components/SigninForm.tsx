'use client';

import { FormEvent } from 'react';
import { login } from '../libs/server-actions';

const SigninForm = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    login(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
};

export default SigninForm;
