'use client';

import { FC, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { editProfileSchema } from '../libs/validation';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { Input } from './input';
import { Button } from './button';

type TEditProfileFormProps = {
  name?: 'username' | 'firstName' | 'lastName';
};

const EditProfileForm: FC<TEditProfileFormProps> = ({ name }) => {
  const [startTransition, isPending] = useTransition();

  const form = useForm<z.infer<typeof editProfileSchema>>({
    defaultValues: {
      username: undefined,
      firstName: undefined,
      lastName: undefined,
      birthDate: undefined,
      image: null,
    },
  });

  const onSubmit = (values: z.infer<typeof editProfileSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {name && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name}</FormLabel>
                <FormControl>
                  <Input placeholder={name} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full bg-customPrimary" disabled={isPending}>
          Изменить
        </Button>
      </form>
    </Form>
  );
};

export default EditProfileForm;
