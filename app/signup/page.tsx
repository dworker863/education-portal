import Modal from '@/app/components/modal';
import SignupForm from '@/app/components/signup-form';

export default function SignupPage() {
  return (
    <section className="flex align-middle justify-center w-full h-full">
      <Modal
        type="registration-page"
        headerLabel="Создать аккаунт"
        backButtonLabel="Уже есть аккаунт?"
        backButtonHref="/signin"
        showSocials
      >
        <SignupForm />
      </Modal>
    </section>
  );
}
