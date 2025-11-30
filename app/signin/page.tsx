'use client';

import Modal from '@/app/components/modal';
import { useContext, useEffect } from 'react';
import { ModalContext } from '../components/app-wrapper';
import SigninForm from '../components/signin-form';
import { OverlayContext } from '../components/overlay';

const SignIn = () => {
  const modalContext = useContext(ModalContext);
  const overlayContext = useContext(OverlayContext);

  useEffect(() => {
    if (!modalContext && !overlayContext) return;

    const prevModal = modalContext?.isModalOpen;
    const prevOverlayActive = overlayContext?.active;

    modalContext?.setIsModalOpen(true);
    overlayContext?.setActive(false);

    return () => {
      modalContext?.setIsModalOpen(prevModal ?? false);
      overlayContext?.setActive(prevOverlayActive ?? true);
    };
  }, [modalContext, overlayContext]);

  return (
    <div className="flex items-center justify-center w-full h-full -translate-y-16">
      <Modal
        type="login-page"
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

export default SignIn;
