'use client';

import { FormEvent, useState } from 'react';
import { login } from '../libs/server-actions';

const SigninForm = () => {
  const [error, setError] = useState(null);
  const handleSubmit = async (provider: string, e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const user = login(provider, formData)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
      });
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
      {error && <p className="text-red-600">{error}</p>}
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
