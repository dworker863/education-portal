import Modal from '@/app/components/modal';
import SignupForm from '@/app/components/signup-form';
import React from 'react';

const SignUp = () => {
  return (
    <Modal
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/signin"
      showSocials
    >
      <SignupForm />
    </Modal>
  );
};

export default SignUp;
