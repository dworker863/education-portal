'use client';

import Modal from '../components/modal';
import NewPasswordForm from '../components/new-password-form';

export default function Page() {
  return (
    <section className="h-screen flex items-center justify-center relative w-full z-100">
      <Modal
        type="new-password"
        headerLabel=""
        backButtonLabel="Нет аккаунта?"
        backButtonHref="/signup"
        showSocials
      >
        <NewPasswordForm />
      </Modal>
    </section>
  );
}
