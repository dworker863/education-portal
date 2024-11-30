'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/form';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { lessonSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/input';
import { FC, useState } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { Button } from '@/app/components/button';
import { FaPlus } from 'react-icons/fa';
import { Textarea } from './textarea';
import Dropzone from 'react-dropzone';

type TLessonFormProps = {
  courseId?: string;
  exerciseId?: string;
};

const LessonForm: FC<TLessonFormProps> = ({ courseId }) => {
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: '',
      content: '',
      images: null,
      video: null,
      courseId,
    },
  });

  const imagesRef = form.register('images');
  const videoRef = form.register('video');

  const onSubmit = async (values: z.infer<typeof lessonSchema>) => {
    const formData = new FormData();

    for (const key in values) {
      const value = values[key as keyof typeof values];

      if (key !== 'images' && key !== 'video' && value !== undefined) {
        formData.append(key, value);
      }
    }

    if (values.images) {
      formData.append('images', values.images[0]);
    }

    if (values.video) {
      formData.append('video', values.video[0]);
    }

    const res = await fetch('/api/lesson', {
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
  };

  return (
    <>
      <Button
        className="mb-5"
        variant="secondary"
        onClick={() => setShowForm(!showForm)}
      >
        <FaPlus size={20} color="#c2410c" />
        <span className="ml-2">{!showForm ? 'Добавить Урок' : 'Скрыть'}</span>
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текст</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Текст урока" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображения</FormLabel>
                  <FormControl>
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        form.setValue('images', acceptedFiles, {
                          shouldValidate: true,
                        });
                        console.log(form.getValues('images'));
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
                          <aside>
                            {/* <h4>Files</h4> */}
                            {/* <ul>{files}</ul> */}
                          </aside>
                          {field.value && (
                            <p className="mt-2 text-sm text-gray-600">
                              Загруженный файл: {field.value[0].name}
                            </p>
                          )}
                        </section>
                      )}
                    </Dropzone>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Видео</FormLabel>
                  <FormControl>
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        form.setValue('video', acceptedFiles, {
                          shouldValidate: true,
                        });
                        console.log(form.getValues('video'));
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
                              accept="video/*"
                              {...getInputProps()}
                            />
                            <div className=" flex flex-col items-center gap-4 w-fit min-w-[275px] px-10 py-6 border border-orange-700 rounded-lg cursor-pointer text-base text-gray-500 ">
                              <p className=" text-gray-500 text">
                                Загрузите видео
                              </p>
                              <FaPlus size={20} color="#c2410c" />
                            </div>
                          </div>
                          <aside>
                            {/* <h4>Files</h4> */}
                            {/* <ul>{files}</ul> */}
                          </aside>
                          {field.value && (
                            <p className="mt-2 text-sm text-gray-600">
                              Загруженный файл: {field.value[0].name}
                            </p>
                          )}
                        </section>
                      )}
                    </Dropzone>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <Button type="submit">Добавить Урок</Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default LessonForm;
