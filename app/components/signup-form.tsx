'use client';

import { useContext, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { registrationSchema } from '../libs/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import Dropzone from 'react-dropzone';
import { FaPlus } from 'react-icons/fa';
import Thumbnails from './thumbnails';
import RequiredSign from './required-sign';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '../libs/cn';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ru } from 'date-fns/locale';
import { ModalContext } from './app-wrapper';

const SignupForm = () => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const [isPending, startTransiton] = useTransition();

  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      birthDate: undefined,
      image: null,
    },
  });

  const onSubmit = (values: z.infer<typeof registrationSchema>) => {
    startTransiton(async () => {
      try {
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
          return;
        }

        if (data.success) {
          setSuccess(data.success);
          setError(null);
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        setError('Что-то пошло не так. Попробуйте снова.');
        setSuccess(null);
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8 text-primary-foreground" onSubmit={form.handleSubmit(onSubmit)}>
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
              name="name"
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
        <div className="flex w-full gap-5">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow gap-1">
                <FormLabel>Дата рождения</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          ' pl-3 text-left text-primary font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'd MMMM yyyy', { locale: ru }) : <span>Укажите дату</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-primary" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      month={field.value}
                      onSelect={field.onChange}
                      onMonthChange={field.onChange}
                      locale={ru}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className="flex flex-col flex-grow gap-1">
            <FormLabel>Укажите год</FormLabel>
            <Select
              onValueChange={(year) => form.setValue('birthDate', new Date(new Date().setFullYear(Number(year))))}
              defaultValue={String(year)}
            >
              <FormControl className="w-[85px] text-primary bg-primary-foreground">
                <SelectTrigger>
                  <SelectValue placeholder="Год" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        </div>
        <Controller
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="w-[275px]">
              <FormLabel>Аватар</FormLabel>
              <FormControl>
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    form.setValue('image', acceptedFiles, {
                      shouldValidate: true,
                    });
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className="container ">
                      <div {...getRootProps({ className: 'dropzone disabled' })}>
                        <input type="file" accept="image/*" {...getInputProps()} />
                        <div className=" flex flex-col items-center gap-4 w-fit min-w-[275px] px-10 py-6 border border-customPrimary rounded-lg cursor-pointer text-base text-muted-foreground ">
                          <p className=" text-muted-foreground text">Загрузите изображение</p>
                          <FaPlus className="text-customPrimary" size={20} />
                        </div>
                      </div>
                      {field.value && (
                        <Thumbnails field={field.name} thumbnails={field.value} closeBtnHandler={form.setValue} />
                      )}
                    </section>
                  )}
                </Dropzone>
              </FormControl>
              {form.formState.errors.image && (
                <p className="text-destructive text-sm mt-2">{form.formState.errors.image.message as string}</p>
              )}
            </FormItem>
          )}
        />

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button type="submit" className="w-full bg-customPrimary" disabled={isPending}>
          Зарегистрироваться
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
