import Modal from '@/app/components/modal';
import SigninForm from '@/app/components/signin-form';

export default function Login() {
  return (
    <Modal
      type="login"
      headerLabel="Добро пожаловать"
      backButtonLabel="Нет аккаунта?"
      backButtonHref="/signup"
      showSocials
    >
      <SigninForm />
    </Modal>
  );
}
