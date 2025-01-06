'use client';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { createCourseSchema, editCourseSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/form';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';
import { FC, useState, useTransition } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { FaPlus } from 'react-icons/fa';
import { Textarea } from '@/app/components/textarea';
import Dropzone from 'react-dropzone';
import Thumbnails from './thumbnails';
import RequiredSign from './required-sign';
import { useRouter } from 'next/navigation';

type TCourseFormProps = {
  courseId?: string;
  mode: 'create' | 'edit';
};

const CourseForm: FC<TCourseFormProps> = ({ courseId, mode }) => {
  const [isPending, startTransiton] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(mode === 'create' ? false : true);
  const schema = mode === 'create' ? createCourseSchema : editCourseSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: mode === 'create' ? '' : undefined,
      description: mode === 'create' ? '' : undefined,
      icon: null,
      priceUSD: mode === 'create' ? '' : undefined,
      category: mode === 'create' ? '' : undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    startTransiton(async () => {
      const formData = new FormData();

      if (courseId) {
        formData.append('id', courseId);
      }

      for (const key in values) {
        const value = values[key as keyof typeof values];

        if (key !== 'icon' && value !== undefined) {
          formData.append(key, value);
        }
      }

      if (values.icon) {
        formData.append('icon', values.icon[0]);
      }

      const res = await fetch('api/course', {
        method: mode === 'create' ? 'POST' : 'PATCH',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setSuccess(null);
        setError(data.error);
        return;
      }

      if (data.success) {
        setError(null);
        setSuccess(data.success);
      }

      router.refresh();
    });
  };

  return (
    <>
      {mode === 'create' ? (
        <Button
          className="mb-5"
          variant="secondary"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus size={20} color="#c2410c" />
          <span className="ml-2">{!showForm ? 'Добавить Курс' : 'Скрыть'}</span>
        </Button>
      ) : null}
      {showForm && (
        <Form {...form}>
          <form
            className="space-y-8 mb-5 px-5 py-10 w-[400px] rounded-md bg-white text-black"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <RequiredSign />
                  <FormControl>
                    <Input placeholder="Название" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <RequiredSign />
                  <FormControl>
                    <Textarea
                      placeholder="Добавьте описание сюда"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <RequiredSign />
                  <FormControl>
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        form.setValue('icon', acceptedFiles, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="container ">
                          <div
                            {...getRootProps({
                              className: 'dropzone disabled',
                            })}
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
                  {form.formState.errors.icon && (
                    <p className="text-red-500 text-sm mt-2">
                      {form.formState.errors.icon.message as string}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceUSD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена USD</FormLabel>
                  <RequiredSign />
                  <FormControl>
                    <Input placeholder="Цена" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <RequiredSign />
                  <FormControl>
                    <Input placeholder="Категория" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <Button type="submit" disabled={isPending}>
              {mode === 'create' ? 'Добавить Курс' : 'Редактировать'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default CourseForm;
