'use client';

import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';
import { createTestSchema } from '../libs/validation';
import { FormControl, FormField, FormItem, FormLabel } from './form';
import { Input } from './input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from './textarea';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { Button } from './button';
import { startTransition, useState, useTransition } from 'react';

const TestForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createTestSchema>>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      name: '',
      task: '',
      variants: [],
      solution: '',
      language: '',
      requiredRank: '',
      prizePoints: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof createTestSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Название" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Задание</FormLabel>
              <FormControl>
                <Textarea placeholder="Задание" rows={5} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="variants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Варианты ответа:</FormLabel>
              {[...Array(4)].map((_, index) => (
                <Input key={index} {...form.register(`variants.${index}`)} placeholder={`Вариант ${index + 1}`} />
              ))}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="solution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ответ</FormLabel>
              <FormControl>
                <Textarea placeholder="Ответ" rows={5} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ответ</FormLabel>
              <FormControl>
                <Input placeholder="Язык программирования" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requiredRank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ответ</FormLabel>
              <FormControl>
                <Input placeholder="Необходимый уровень" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prizePoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ответ</FormLabel>
              <FormControl>
                <Input
                  placeholder="Колличество призовых баллов"
                  {...form.register('prizePoints', { valueAsNumber: true })}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button variant="custom" type="submit" disabled={isPending}>
          Добавить Упражнение
        </Button>
      </form>
    </Form>
  );
};

export default TestForm;
