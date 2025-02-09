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
    if (modalContext) {
      modalContext.setIsModalOpen(true);
    }

    if (overlayContext) {
      overlayContext.setActive(false);
    }
  }, [modalContext, overlayContext]);

  return (
    <div className="flex align-middle justify-center">
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
