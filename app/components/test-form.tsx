'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createTestSchema, editTestSchema } from '../libs/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from './input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from './textarea';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { Button } from './button';
import { FC, useState, useTransition } from 'react';
import { FaPlus } from 'react-icons/fa';
import RequiredSign from './required-sign';
import { useRouter } from 'next/navigation';
import { addTest, editTest } from '../libs/server-actions/tests-actions';

type TTestFormProps = {
  testId?: string;
  lessonId?: string;
  mode: 'create' | 'edit';
};

const TestForm: FC<TTestFormProps> = ({ lessonId, testId, mode }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [showForm, setShowForm] = useState(mode === 'create' ? false : true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const schema = mode === 'create' ? createTestSchema : editTestSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: mode === 'create' ? '' : undefined,
      task: mode === 'create' ? '' : undefined,
      variants: mode === 'create' ? ['', '', '', ''] : undefined,
      solution: mode === 'create' ? '' : undefined,
      language: mode === 'create' ? '' : undefined,
      requiredRank: mode === 'create' ? '' : undefined,
      prizePoints: mode === 'create' ? 0 : undefined,
      lessonId: lessonId || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (values.variants) {
      values.variants = values.variants.every((variant) => variant === '') ? undefined : values.variants;
    }

    if (mode === 'create') {
      startTransition(async () => {
        try {
          const response = await addTest(values as z.infer<typeof createTestSchema>);

          setError(null);
          setSuccess(response.success);

          setTimeout(() => {
            router.refresh();
          }, 1500);
        } catch (error) {
          setSuccess(null);
          console.error('Ошибка при выполнении запроса:', error);
          setError('Что-то пошло не так. Попробуйте снова.');
        }
      });
    }

    if (testId) {
      startTransition(async () => {
        try {
          const response = await editTest(testId, values as z.infer<typeof editTestSchema>);

          setError(null);
          setSuccess(response.success);

          setTimeout(() => {
            router.refresh();
          }, 1500);
        } catch (error) {
          setSuccess(null);
          console.error('Ошибка при выполнении запроса:', error);
          setError('Что-то пошло не так. Попробуйте снова.');
        }
      });
    }
  };

  return (
    <>
      {mode === 'create' && (
        <Button variant="custom" className="ml-5 mb-5" onClick={() => setShowForm(!showForm)}>
          <FaPlus size={20} />
          <span className="ml-2">{!showForm ? 'Добавить Тест' : 'Скрыть'}</span>
        </Button>
      )}
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
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Задание</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Textarea placeholder="Задание" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Варианты ответа:</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  {[...Array(4)].map((_, index) => (
                    <div key={index}>
                      <FormControl>
                        <Input
                          {...form.register(`variants.${index}`, { required: true })}
                          placeholder={`Вариант ${index + 1}`}
                        />
                      </FormControl>
                      <p className="text-destructive text-xs my-2">
                        {form.formState.errors.variants?.[index]?.message}
                      </p>
                    </div>
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
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Textarea placeholder="Ответ" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Язык</FormLabel>
                  {mode === 'create' && <RequiredSign />}
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
              name="prizePoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Баллы</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Колличество призовых баллов"
                      {...form.register('prizePoints', { valueAsNumber: true })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <Button variant="custom" type="submit" disabled={isPending}>
              {mode === 'create' ? 'Добавить Тест' : 'Редактировать Тест'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default TestForm;
