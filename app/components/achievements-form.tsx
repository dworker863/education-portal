'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createAchievementSchema } from '../libs/validation';
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

const AchievementsForm = () => {
  const [isPending, startTransiton] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createAchievementSchema>>({
    resolver: zodResolver(createAchievementSchema),
    defaultValues: {
      name: '',
      task: '',
      language: '',
      requiredRank: '',
      discount: 0,
      courseName: '',
    },
  });

  const onSubmit = (values: z.infer<typeof createAchievementSchema>) => {
    console.log(values);
  };

  return (
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
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Условия</FormLabel>
              <RequiredSign />
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
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Язык программирования</FormLabel>
              <FormControl>
                <Input placeholder="Язык программирования" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requiredRank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Уровень</FormLabel>
              <FormControl>
                <Input placeholder="Необходимый уровень" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Скидка</FormLabel>
              <FormControl>
                <Input
                  placeholder="Скидка в процентах"
                  {...field}
                  {...form.register('discount', {
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
          name="courseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Курс</FormLabel>
              <FormControl>
                <Input placeholder="Курс, на который распространяется призовой бонус" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button variant="custom" type="submit" disabled={isPending}>
          Добавить Курс
        </Button>
      </form>
    </Form>
  );
};

export default AchievementsForm;
