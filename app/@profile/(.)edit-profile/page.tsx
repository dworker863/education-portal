import EditProfileForm from '@/app/components/edit-profile-form';
import Modal from '@/app/components/modal';
import React from 'react';

const SignUp = ({ searchParams }: { searchParams: { field: 'username' | 'firstName' | 'lastName' } }) => {
  return (
    <Modal type="edit-profile" headerLabel="Изменить профиль" backButtonLabel="Назад" backButtonHref="/">
      <EditProfileForm fieldName={searchParams.field} />
    </Modal>
  );
};

export default SignUp;
