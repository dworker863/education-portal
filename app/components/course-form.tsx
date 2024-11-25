'use client';

import { useForm } from 'react-hook-form';
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

const CourseForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
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
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="icon"
                      type="file"
                      accept="image/*"
                      {...fileRef}
                    />
                  </FormControl>
                  <FormMessage />
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
