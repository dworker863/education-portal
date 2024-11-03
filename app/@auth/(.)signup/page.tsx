import Modal from '@/app/components/Modal';
import SignupForm from '@/app/components/SignupForm';
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
