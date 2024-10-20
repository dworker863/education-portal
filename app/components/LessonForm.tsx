'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { addLessonSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import { Button } from '@/components/ui/button';

const LessonForm = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const form = useForm<z.infer<typeof addLessonSchema>>({
    resolver: zodResolver(addLessonSchema),
    defaultValues: {
      name: '',
      content: '',
      images: [],
      video: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof addLessonSchema>) => {
    console.log(values);
    const data = await fetch('/api/lesson', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    // const lesson = await data.json();
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="content" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input placeholder="Insert Image" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input placeholder="Insert Image" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button type="submit">Add Lesson</Button>
      </form>
    </Form>
  );
};

export default LessonForm;
