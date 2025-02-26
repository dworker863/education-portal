'use client';

import { FC, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { editProfileSchema } from '../libs/validation';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { Input } from './input';
import { Button } from './button';

type TEditProfileFormProps = {
  fieldName?: 'username' | 'firstName' | 'lastName';
};

const EditProfileForm: FC<TEditProfileFormProps> = ({ fieldName }) => {
  const [isPending, startTransition] = useTransition();

  const label = fieldName === 'firstName' ? 'Имя' : fieldName === 'lastName' ? 'Фамилия' : 'Ник';

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
      <form className="space-y-8 text-primary-foreground" onSubmit={form.handleSubmit(onSubmit)}>
        {fieldName && (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input placeholder={label} {...field} />
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
