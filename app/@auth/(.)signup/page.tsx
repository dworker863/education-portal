import Modal from '@/app/components/modal';
import SignupForm from '@/app/components/signup-form';
import React from 'react';

const SignUp = () => {
  return (
    <Modal
      type="registration"
      headerLabel="Создать аккаунт"
      backButtonLabel="Уже есть аккаунт?"
      backButtonHref="/signin"
      showSocials
    >
      <SignupForm />
    </Modal>
  );
};

export default SignUp;
