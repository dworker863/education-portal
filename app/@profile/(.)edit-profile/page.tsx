import EditProfileForm from '@/app/components/edit-profile-form';
import Modal from '@/app/components/modal';
import React from 'react';

const SignUp = ({
  searchParams,
}: {
  searchParams: {
    field: 'name' | 'firstName' | 'lastName' | undefined;
    type: 'birthDate' | 'image' | undefined;
    email: string;
  };
}) => {
  return (
    <Modal type="edit-profile" headerLabel="Изменить профиль" backButtonLabel="Назад" backButtonHref="/">
      <EditProfileForm email={searchParams.email} fieldName={searchParams.field} type={searchParams.type} />
    </Modal>
  );
};

export default SignUp;
