import Modal from '@/app/components/Modal';
import SignupForm from '@/app/components/SignupForm';
import React from 'react';

const SignUp = () => {
  return (
    <Modal
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account"
      backButtonHref="/signup"
      showSocials
    >
      <SignupForm />
    </Modal>
  );
};

export default SignUp;
