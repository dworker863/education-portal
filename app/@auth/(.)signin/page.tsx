import Modal from '@/app/components/Modal';
import SigninForm from '@/app/components/SigninForm';

export default function Login() {
  return (
    <Modal
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account"
      backButtonHref="/signup"
      showSocials
    >
      <SigninForm />
    </Modal>
  );
}
