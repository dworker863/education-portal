'use client';

import Modal from '@/app/components/modal';
import { useContext, useEffect } from 'react';
import { ModalContext } from '../components/app-wrapper';
import { OverlayContext } from '../components/overlay';
import SigninForm from '../components/signin-form';

const SignUp = () => {
  const modalContext = useContext(ModalContext);
  const overlayContext = useContext(OverlayContext);

  useEffect(() => {
    if (modalContext) {
      modalContext.setIsModalOpen(true);
    }

    if (overlayContext) {
      overlayContext.setActive(false);
    }
  }, [modalContext, overlayContext]);

  return (
    <div className="flex items-center justify-center w-full h-full -translate-y-16">
      <Modal
        type="login"
        headerLabel="Добро пожаловать"
        backButtonLabel="Нет аккаунта?"
        backButtonHref="/signup"
        showSocials
      >
        <SigninForm />
      </Modal>
    </div>
  );
};

export default SignUp;
