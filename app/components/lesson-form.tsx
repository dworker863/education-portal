'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/form';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { createLessonSchema, editLessonSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/input';
import { FC, useMemo, useState, useTransition } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { Button } from '@/app/components/button';
import { FaPlus } from 'react-icons/fa';
import { Textarea } from './textarea';
import Dropzone from 'react-dropzone';
import Thumbnails from './thumbnails';
import RequiredSign from './required-sign';
import { useRouter } from 'next/navigation';
import { getSectionByNameAndCourseId } from '../libs/server-actions/sections-actions';

type TLessonFormProps = {
  mode: 'create' | 'edit';
  courseId?: string;
  exerciseId?: string;
  lessonId?: string;
};

const LessonForm: FC<TLessonFormProps> = ({ mode, courseId, lessonId }) => {
  const [isPending, startTransiton] = useTransition();
  const router = useRouter();

  const [showForm, setShowForm] = useState(mode === 'create' ? false : true);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const schema = useMemo(
    () => (mode === 'create' ? createLessonSchema : editLessonSchema),
    [mode],
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: mode === 'create' ? '' : undefined,
      content: mode === 'create' ? '' : undefined,
      section: mode === 'create' ? '' : undefined,
      images: null,
      video: null,
      courseId,
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransiton(async () => {
      try {
        const formData = new FormData();

        if (lessonId) {
          formData.append('id', lessonId);
        }

        for (const key in values) {
          const value = values[key as keyof typeof values];

          if (
            key !== 'images' &&
            key !== 'video' &&
            key !== 'section' &&
            value !== undefined
          ) {
            formData.append(key, value);
          }
        }

        if (values.images && values.images.length > 0) {
          values.images.forEach((image) => {
            formData.append('images', image);
          });
        }

        if (values.video) {
          formData.append('video', values.video[0]);
        }

        if (courseId && values.section) {
          const section = await getSectionByNameAndCourseId(
            values.section,
            courseId,
          );

          if (section) {
            formData.append('sectionId', section.id);
            console.log('section', section.id);
          }
        }

        const res = await fetch('/api/lesson', {
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
          setTimeout(() => {
            router.refresh();
          }, 1500);
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        setError('Что-то пошло не так. Попробуйте снова.');
        setSuccess(null);
      }
    });
  };

  return (
    <>
      {mode === 'create' ? (
        <Button
          variant="custom"
          className="mb-5"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus size={20} />
          <span className="ml-2">{!showForm ? 'Добавить Урок' : 'Скрыть'}</span>
        </Button>
      ) : null}

      {showForm && (
        <Form {...form}>
          <form
            className="space-y-8 mb-5 px-5 py-10 w-[400px] rounded-md bg-customBlock"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  {mode === 'create' && <RequiredSign />}
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
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Textarea placeholder="Текст урока" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Раздел</FormLabel>
                  <FormControl>
                    <Input placeholder="Раздел" {...field} />
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
                        setFiles((prevFiles) => [
                          ...prevFiles,
                          ...acceptedFiles,
                        ]);
                        form.setValue('images', [...files, ...acceptedFiles], {
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
                              multiple
                              {...getInputProps()}
                            />
                            <div className=" flex flex-col items-center gap-4 w-fit min-w-[275px] px-10 py-6 border border-customPrimary rounded-lg cursor-pointer text-base text-muted-foreground ">
                              <p className=" text-muted-foreground">
                                Загрузите изображение
                              </p>
                              <FaPlus
                                className="text-customPrimary"
                                size={20}
                              />
                            </div>
                          </div>
                          {field.value && (
                            <Thumbnails
                              field={field.name}
                              thumbnails={files}
                              closeBtnHandler={form.setValue}
                            />
                          )}
                        </section>
                      )}
                    </Dropzone>
                  </FormControl>
                  {form.formState.errors.images && (
                    <>
                      {form.formState.errors.images.message && (
                        <p className="text-destructive text-sm mt-2">
                          {form.formState.errors.images.message}
                        </p>
                      )}

                      {Array.isArray(form.formState.errors.images) &&
                        form.formState.errors.images.map((error, index) => (
                          <p
                            key={index}
                            className="text-destructive text-sm mt-2"
                          >
                            {`Файл ${index + 1}: ${error?.message}`}
                          </p>
                        ))}
                    </>
                  )}
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
                            <div className=" flex flex-col items-center gap-4 w-fit min-w-[275px] px-10 py-6 border border-customPrimary rounded-lg cursor-pointer text-base text-muted-foreground ">
                              <p className=" text-muted-foreground text">
                                Загрузите видео
                              </p>
                              <FaPlus
                                className="text-customPrimary"
                                size={20}
                              />
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
                  {form.formState.errors.video && (
                    <p className="text-destructive text-sm mt-2">
                      {form.formState.errors.video.message as string}
                    </p>
                  )}
                </FormItem>
              )}
            />
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <Button variant="custom" type="submit" disabled={isPending}>
              {mode === 'create' ? 'Добавить Урок' : 'Редактировать'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default LessonForm;
