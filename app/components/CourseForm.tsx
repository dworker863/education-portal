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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

const CourseForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input
                  placeholder="icon"
                  type="file"
                  accept="image/*"
                  {...fileRef}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceUSD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price USD</FormLabel>
              <FormControl>
                <Input placeholder="priceUSD" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="category" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button type="submit">Add Course</Button>
      </form>
    </Form>
  );
};

export default CourseForm;
