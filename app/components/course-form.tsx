'use client';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { courseSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/form';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';
import { useState } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { FaPlus } from 'react-icons/fa';
import { Textarea } from '@/app/components/textarea';
import Dropzone from 'react-dropzone';
import Thumbnails from './thumbnails';

const CourseForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: null,
      priceUSD: '',
      category: '',
    },
  });

  const fileRef = form.register('icon');

  const onSubmit = async (values: z.infer<typeof courseSchema>) => {
    const formData = new FormData();

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
      method: 'POST',
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
  };

  return (
    <>
      <Button
        className="mb-5"
        variant="secondary"
        onClick={() => setShowForm(!showForm)}
      >
        <FaPlus size={20} color="#c2410c" />
        <span className="ml-2">{!showForm ? 'Добавить Курс' : 'Скрыть'}</span>
      </Button>
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
                  <FormControl>
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        form.setValue('icon', acceptedFiles, {
                          shouldValidate: true,
                        });
                        console.log(form.getValues('icon'));
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
                  <FormControl>
                    <Input placeholder="Категория" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <Button type="submit">Добавить Курс</Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default CourseForm;
