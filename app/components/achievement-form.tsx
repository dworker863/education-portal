'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { FC, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createAchievementSchema, editAchievementSchema } from '../libs/validation';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from '@/app/components/input';
import { Textarea } from './textarea';
import Dropzone from 'react-dropzone';
import { FaPlus } from 'react-icons/fa';
import Thumbnails from './thumbnails';
import RequiredSign from './required-sign';
import ErrorMessage from './error-message';
import { Button } from './button';
import SuccessMessage from './success-message';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

type TAchievementFormProps = {
  mode: 'create' | 'edit';
  achievementId?: string;
};

const AchievementForm: FC<TAchievementFormProps> = ({ mode, achievementId }) => {
  const [isPending, startTransiton] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(mode === 'create' ? false : true);

  const schema = mode === 'create' ? createAchievementSchema : editAchievementSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: mode === 'create' ? '' : undefined,
      description: mode === 'create' ? '' : undefined,
      icon: null,
      startDate: mode === 'create' ? '' : undefined,
      endDate: mode === 'create' ? '' : undefined,
      criteria: {
        type: 'COURSE_COMPLETION',
      },
    },
  });

  const type = form.watch('criteria.type');

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransiton(async () => {
      try {
        const formData = new FormData();

        if (achievementId) {
          formData.append('id', achievementId);
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

        const res = await fetch('/api/achievement', {
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
        <Button variant="custom" className="mb-5" onClick={() => setShowForm(!showForm)}>
          <FaPlus size={20} />
          <span className="ml-2">{!showForm ? 'Добавить Достижение' : 'Скрыть'}</span>
        </Button>
      ) : null}
      {showForm && (
        <Form {...form}>
          <form
            className="space-y-8 mb-5 px-5 py-10 w-[400px] rounded-md bg-primary"
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
                  <FormLabel>Условия</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Textarea placeholder="Условия достижения" rows={5} {...field} />
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
                            <input type="file" accept="image/*" {...getInputProps()} />
                            <div className=" flex flex-col items-center gap-4 w-fit min-w-[275px] px-10 py-6 border border-customPrimary rounded-lg cursor-pointer text-base">
                              <p className="text-muted-foreground">Загрузите изображение</p>
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
                  {form.formState.errors.icon && (
                    <p className="text-destructive text-sm mt-2">{form.formState.errors.icon.message as string}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
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
              name="endDate"
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
              name="criteria.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Тип достижения</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="w-[300px]">
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип достижения" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EXERCISE_COMPLETION">EXERCISE_COMPLETION</SelectItem>
                      <SelectItem value="COURSE_COMPLETION">COURSE_COMPLETION</SelectItem>
                      <SelectItem value="COURSE_REGISTRATION">COURSE_REGISTRATION</SelectItem>
                      <SelectItem value="PARTICIPATION_LIMIT">PARTICIPATION_LIMIT</SelectItem>
                      <SelectItem value="SUBSCRIPTION">SUBSCRIPTION</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {type === 'EXERCISE_COMPLETION' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Данные физического лица</h3>
                <FormField
                  control={form.control}
                  name="criteria.exercisesIds"
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
                  name="criteria.language"
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
                  name="criteria.prizePoints"
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
                  name="criteria.requiredRank"
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
              </div>
            )}
            {type === 'COURSE_COMPLETION' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Данные физического лица</h3>
                <FormField
                  control={form.control}
                  name="criteria.coursesIds"
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
                  name="criteria.minPrize"
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
                  name="criteria.maxPrize"
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
                  name="criteria.requiredRank"
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
              </div>
            )}
            {type === 'COURSE_REGISTRATION' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Данные физического лица</h3>
                <FormField
                  control={form.control}
                  name="criteria.coursesIds"
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
                  name="criteria.minPrize"
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
                  name="criteria.maxPrize"
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
                  name="criteria.requiredRank"
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
              </div>
            )}
            {type === 'PARTICIPATION_LIMIT' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Данные физического лица</h3>
                <FormField
                  control={form.control}
                  name="criteria.maxParticipants"
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
                  name="criteria.requiredRank"
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
              </div>
            )}
            {type === 'SUBSCRIPTION' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Данные физического лица</h3>
                <FormField
                  control={form.control}
                  name="criteria.tier"
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
                  name="criteria.duration"
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
                  name="criteria.firstTimeOnly"
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
              </div>
            )}
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <Button variant="custom" type="submit" disabled={isPending}>
              {mode === 'create' ? 'Добавить Достижение' : 'Редактировать'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default AchievementForm;
