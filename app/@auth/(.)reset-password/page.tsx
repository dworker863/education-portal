import Modal from '@/app/components/modal';
import ResetPasswordForm from '@/app/components/reset-password-form';

export default function ResetPassword() {
  return (
    <Modal
      type="reset-password"
      headerLabel=""
      backButtonLabel="Нет аккаунта?"
      backButtonHref="/signup"
      showSocials
    >
      <ResetPasswordForm />
    </Modal>
  );
}
