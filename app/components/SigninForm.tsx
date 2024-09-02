'use client';

import { FormEvent } from 'react';

const SigninForm = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    console.log(data);
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
