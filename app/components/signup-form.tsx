'use client';

import { useContext, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { registrationSchema } from '../libs/validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { ModalContext } from './app-wrapper';
import Dropzone from 'react-dropzone';
import { FaPlus } from 'react-icons/fa';
import Thumbnails from './thumbnails';
import RequiredSign from './required-sign';
import DatePicker from './date-pricker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { cn } from '../libs/cn';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { format } from 'date-fns';

const SignupForm = () => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const [isPending, startTransiton] = useTransition();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      birthDate: undefined,
      image: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof registrationSchema>) => {
    startTransiton(async () => {
      console.log('SIGNUP FORM', typeof values.birthDate);

      const formData = new FormData();

      for (const key in values) {
        const value = values[key as keyof typeof values];

        if (key !== 'image' && value !== undefined) {
          formData.append(key, value);
        }
      }

      if (values.image) {
        formData.append('image', values.image[0]);
      }

      const res = await fetch('api/signup', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setSuccess(null);
      }

      if (data.success) {
        setSuccess(data.success);
        setError(null);
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <RequiredSign />
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя пользователя</FormLabel>
                  <FormControl>
                    <Input placeholder="Имя пользователя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <RequiredSign />
                  <FormControl>
                    <Input placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 space-y-6">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтвердить пароль</FormLabel>
                  <RequiredSign />
                  <FormControl>
                    <Input placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input placeholder="Фамилия" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дата рождения</FormLabel>
              {/* <Input type="date" {...field} /> */}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Укажите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Аватар</FormLabel>
              <FormControl>
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    form.setValue('image', acceptedFiles, {
                      shouldValidate: true,
                    });
                    console.log(form.getValues('image'));
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className="container ">
                      <div
                        {...getRootProps({ className: 'dropzone disabled' })}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          {...getInputProps()}
                        />
                        <div className=" flex flex-col items-center gap-4 w-fit min-w-[275px] px-10 py-6 border border-orange-700 rounded-lg cursor-pointer text-base text-gray-500 ">
                          <p className=" text-gray-500 text">
                            Загрузите изображение
                          </p>
                          <FaPlus size={20} color="#c2410c" />
                        </div>
                      </div>
                      {field.value && (
                        <Thumbnails
                          field={field.name}
                          thumbnails={field.value}
                          closeBtnHandler={form.setValue}
                        />
                      )}
                    </section>
                  )}
                </Dropzone>
              </FormControl>
              {form.formState.errors.image && (
                <p className="text-red-500 text-sm mt-2">
                  {form.formState.errors.image.message as string}
                </p>
              )}
            </FormItem>
          )}
        />

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button type="submit" className="w-full" disabled={isPending}>
          Зарегистрироваться
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
