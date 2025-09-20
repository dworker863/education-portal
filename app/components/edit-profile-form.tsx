'use client';

import { FC, useContext, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { editProfileSchema } from '../libs/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from './input';
import { Button } from './button';
import { cn } from '../libs/cn';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import Dropzone from 'react-dropzone';
import { FaPlus } from 'react-icons/fa';
import Thumbnails from './thumbnails';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { useRouter } from 'next/navigation';
import { ModalContext } from './app-wrapper';

type TEditProfileFormProps = {
  email: string;
  fieldName?: 'name' | 'firstName' | 'lastName';
  type?: 'birthDate' | 'image';
};

const EditProfileForm: FC<TEditProfileFormProps> = ({ email, fieldName, type }) => {
  const context = useContext(ModalContext);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [twoFactor, setTwoFactor] = useState(false);

  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i);
  const label = fieldName === 'firstName' ? 'Имя' : fieldName === 'lastName' ? 'Фамилия' : 'Ник';

  const form = useForm<z.infer<typeof editProfileSchema>>({
    defaultValues: {
      name: undefined,
      firstName: undefined,
      lastName: undefined,
      birthDate: undefined,
      image: null,
      code: '',
    },
  });

  const onSubmit = (values: z.infer<typeof editProfileSchema>) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        for (const key in values) {
          const value = values[key as keyof typeof values];

          if (key !== 'image' && value !== undefined) {
            formData.append(key, value);
          }
        }

        if (email) {
          formData.append('email', email);
        }

        if (values.image) {
          formData.append('image', values.image[0]);
        }

        const res = await fetch('api/profile', {
          method: 'PATCH',
          body: formData,
        });

        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setSuccess(null);
          return;
        }

        if (data?.twoFactor) {
          setError(null);
          setTwoFactor(data.twoFactor);
          setSuccess('Код подтверждения отправлен на email');
        }

        if (data.success) {
          setSuccess(data.success);
          setError(null);
          setTimeout(() => {
            context?.setIsModalOpen(false);
            router.back();
          }, 1500);
        }
      } catch (error) {
        setSuccess(null);
        console.error('Ошибка при выполнении запроса:', error);
        setError('Что-то пошло не так. Попробуйте снова.');
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8 text-primary-foreground" onSubmit={form.handleSubmit(onSubmit)}>
        {!twoFactor && (
          <>
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
            {type === 'birthDate' && (
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
                              {field.value ? (
                                format(field.value, 'd MMMM yyyy', { locale: ru })
                              ) : (
                                <span>Укажите дату</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-customBlock" align="start">
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
            )}
            {type === 'image' && (
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
            )}
          </>
        )}
        {twoFactor && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Код подтверждения</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button variant="custom" type="submit" className="w-full" disabled={isPending}>
          {!twoFactor ? 'Изменить' : 'Подтвердить'}
        </Button>
      </form>
    </Form>
  );
};

export default EditProfileForm;
