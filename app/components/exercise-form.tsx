'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { exerciseSchema } from '../libs/validation';
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
import ErrorMessage from './error-message';
import { addExercise } from '../libs/server-actions/exercises-actions';
import { FaPlus } from 'react-icons/fa';
import { Textarea } from './textarea';

type TExerciseProps = {
  lessonId?: string;
};

const ExerciseForm: FC<TExerciseProps> = ({ lessonId }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: '',
      task: '',
      code: '',
      test: '',
      solution: '',
      requiredRank: '',
      prizePoints: '',
      lessonId,
    },
  });

  const onSubmit = async (values: z.infer<typeof exerciseSchema>) => {
    addExercise(values)
      .then((data) => {
        setError(null);
        setSuccess(data.success);
      })
      .catch((error) => {
        setSuccess(null);
        setError(error.message);
      });
  };

  return (
    <>
      <Button
        className="mb-5"
        variant="secondary"
        onClick={() => setShowForm(!showForm)}
      >
        <FaPlus size={20} color="#c2410c" />
        <span className="ml-2">
          {!showForm ? 'Добавить Упражнение' : 'Скрыть'}
        </span>
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
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Задание</FormLabel>
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
                    <Textarea
                      placeholder="Начальный код упражнения"
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
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тест</FormLabel>
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
                  <FormControl>
                    <Textarea placeholder="Код решения" rows={5} {...field} />
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
                  <FormControl>
                    <Input
                      placeholder="Колличество призовых баллов"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorMessage message={error} />}
            {success && <ErrorMessage message={success} />}
            <Button type="submit">Добавить Упражнение</Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default ExerciseForm;
