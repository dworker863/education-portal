import Modal from '@/app/components/modal';
import SigninForm from '@/app/components/signin-form';

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
