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
import { useForm } from 'react-hook-form';
import { lessonSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/input';
import { FC, useState } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { Button } from '@/app/components/button';
import { FaPlus } from 'react-icons/fa';
import { Textarea } from './textarea';

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
      images: [],
      video: '',
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
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображения</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Insert Image"
                      type="file"
                      {...imagesRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Видео</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Insert video"
                      type="file"
                      accept="video/*"
                      {...videoRef}
                    />
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
