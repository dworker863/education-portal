'use client';

import { FC, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createExerciseSchema, editExerciseSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/form';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';
import ErrorMessage from './error-message';
import { addExercise, editExercise } from '../libs/server-actions/exercises-actions';
import { FaPlus } from 'react-icons/fa';
import { Textarea } from './textarea';
import RequiredSign from './required-sign';
import SuccessMessage from './success-message';
import { useRouter } from 'next/navigation';

type TExerciseProps = {
  lessonId?: string;
  exerciseId?: string;
  mode: 'create' | 'edit';
};

const ExerciseForm: FC<TExerciseProps> = ({ lessonId, mode, exerciseId }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(mode === 'create' ? false : true);
  const schema = mode === 'create' ? createExerciseSchema : editExerciseSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: mode === 'create' ? '' : undefined,
      task: mode === 'create' ? '' : undefined,
      code: mode === 'create' ? '' : undefined,
      test: mode === 'create' ? '' : undefined,
      solution: mode === 'create' ? '' : undefined,
      language: mode === 'create' ? '' : undefined,
      requiredRank: mode === 'create' ? '' : undefined,
      prizePoints: mode === 'create' ? 0 : undefined,
      lessonId: lessonId || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (mode === 'create') {
      startTransition(async () => {
        try {
          const response = await addExercise(values as z.infer<typeof createExerciseSchema>);

          setError(null);
          setSuccess(response.success);
        } catch (error) {
          setSuccess(null);
          console.error('Ошибка при выполнении запроса:', error);

          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Что-то пошло не так. Попробуйте снова.');
          }
        }
      });
    }

    if (exerciseId) {
      startTransition(async () => {
        try {
          const response = await editExercise(exerciseId, values as z.infer<typeof editExerciseSchema>);

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
        <Button variant="custom" className="mb-5" onClick={() => setShowForm(!showForm)}>
          <FaPlus size={20} />
          <span className="ml-2">{!showForm ? 'Добавить Упражнение' : 'Скрыть'}</span>
        </Button>
      )}
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Код</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Начальный код упражнения" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тест</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Textarea placeholder="Код теста" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Решение</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  <FormControl>
                    <Textarea placeholder="Код решения" rows={5} {...field} />
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
              {mode === 'create' ? 'Добавить Упражнение' : 'Редактировать Упражнение'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default ExerciseForm;
