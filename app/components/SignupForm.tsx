'use client';

import { FormEvent, useState } from 'react';
import { registration } from '../libs/server-actions';
import { useRouter } from 'next/navigation';
import Button from './Button';

const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    registration(formData)
      .then((data) => {
        router.push('/');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="email">Email</label>
        <br />
        <input id="email" type="email" name="email" />
      </fieldset>
      <fieldset>
        <label htmlFor="name">Username</label>
        <br />
        <input id="name" type="text" name="name" />
      </fieldset>
      <fieldset>
        <label htmlFor="password">Password</label>
        <br />
        <input id="password" type="password" name="password" />
      </fieldset>
      <fieldset>
        <label htmlFor="repeatPassword">Repeat Password</label>
        <br />
        <input id="repeatPassword" type="text" name="repeatPassword" />
      </fieldset>
      <fieldset>
        <label htmlFor="firstName">First Name</label>
        <br />
        <input id="firstName" type="text" name="firstName" />
      </fieldset>
      <fieldset>
        <label htmlFor="lastName">Last Name</label>
        <br />
        <input id="lastName" type="text" name="lastName" />
      </fieldset>
      <fieldset>
        <label htmlFor="birthDate">Birth Date</label>
        <br />
        <input id="birthDate" type="date" name="birthDate" />
      </fieldset>
      <fieldset>
        <label htmlFor="file">Image</label>
        <br />
        <input id="file" type="file" name="file" />
      </fieldset>
      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit" text="Sign Up" />
    </form>
  );
};

export default SignupForm;
