import Modal from '@/app/components/Modal';

export default function Login() {
  return (
    <Modal
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account"
      backButtonHref="/signup"
      showSocials
    >
      Modal: Login
    </Modal>
  );
}
