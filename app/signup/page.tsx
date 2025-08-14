'use client';

import Modal from '@/app/components/modal';
import SignupForm from '@/app/components/signup-form';
import { useContext, useEffect } from 'react';
import { ModalContext } from '../components/app-wrapper';
import { OverlayContext } from '../components/overlay';

const SignUp = () => {
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
    <div className="flex align-middle justify-center w-full h-full">
      <Modal
        type="registration"
        headerLabel="Создать аккаунт"
        backButtonLabel="Уже есть аккаунт?"
        backButtonHref="/signin"
        showSocials
      >
        <SignupForm />
      </Modal>
    </div>
  );
};

export default SignUp;
