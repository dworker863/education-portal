'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
import { FC, useMemo, useState, useTransition } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { FaPlus, FaTrash } from 'react-icons/fa';
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
  const schema = useMemo(
    () => (mode === 'create' ? createCourseSchema : editCourseSchema),
    [mode],
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: mode === 'create' ? '' : undefined,
      description: mode === 'create' ? '' : undefined,
      sections: mode === 'create' ? [] : undefined,
      icon: null,
      priceUSD: mode === 'create' ? 0 : undefined,
      category: mode === 'create' ? '' : undefined,
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({ control: form.control, name: 'sections' });

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransiton(async () => {
      try {
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
          setTimeout(() => {
            router.refresh();
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
    <>
      {mode === 'create' ? (
        <Button
          variant="custom"
          className="mb-5"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus size={20} />
          <span className="ml-2">{!showForm ? 'Добавить Курс' : 'Скрыть'}</span>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  {mode === 'create' && <RequiredSign />}
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
            <Button
              variant="custom"
              type="button"
              onClick={() =>
                appendSection({ name: '', order: sectionFields.length + 1 })
              }
            >
              <FaPlus size={20} />
              <span className="ml-2">Добавить секцию</span>
            </Button>
            {sectionFields.map((section, index) => (
              <div key={section.id} className="p-3 space-y-6">
                <FormField
                  control={form.control}
                  name={`sections.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название подзаголовка</FormLabel>
                      <FormControl>
                        <Input placeholder="Название подзаголовка" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sections.${index}.order`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Порядок подзаголовка</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Порядок подзаголовка"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="custom"
                  onClick={() => {
                    removeSection(index);
                  }}
                >
                  <FaTrash size={16} />
                  <span className="ml-2">Удалить</span>
                </Button>
              </div>
            ))}
            <Controller
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  {mode === 'create' && <RequiredSign />}
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
                            <div className=" flex flex-col items-center gap-4 w-fit min-w-[275px] px-10 py-6 border border-customPrimary rounded-lg cursor-pointer text-base">
                              <p className="text-muted-foreground">
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
                              thumbnails={field.value}
                              closeBtnHandler={form.setValue}
                            />
                          )}
                        </section>
                      )}
                    </Dropzone>
                  </FormControl>
                  {form.formState.errors.icon && (
                    <p className="text-destructive text-sm mt-2">
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
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Цена"
                      {...form.register('priceUSD', {
                        valueAsNumber: true,
                      })}
                    />
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
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Input placeholder="Категория" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <Button variant="custom" type="submit" disabled={isPending}>
              {mode === 'create' ? 'Добавить Курс' : 'Редактировать'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default CourseForm;
