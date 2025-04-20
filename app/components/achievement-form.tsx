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
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../libs/cn';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
      startDate: mode === 'create' ? new Date() : undefined,
      endDate: undefined,
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
            className="space-y-8 mb-5 px-5 py-10 w-[400px] rounded-md bg-primary text-primary-foreground"
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
                <FormItem className="flex flex-col">
                  <FormLabel>Дата начала</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left text-primary font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'd MMMM yyyy', { locale: ru }) : <span>Укажите дату</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-primary" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ru}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата начала</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left text-primary font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'd MMMM yyyy', { locale: ru }) : <span>Укажите дату</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-primary" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ru}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                <h3 className="font-medium">Выполнение упражнений</h3>
                <FormField
                  control={form.control}
                  name="criteria.exercisesIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Упражнения</FormLabel>
                      <FormControl>
                        <Input placeholder="Упражнения" {...field} />
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
                  name="criteria.prizePoints"
                  render={() => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Колличество призовых баллов"
                          {...form.register('criteria.prizePoints', {
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
                  name="criteria.requiredRank"
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
              </div>
            )}
            {type === 'COURSE_COMPLETION' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Завершение курсов</h3>
                <FormField
                  control={form.control}
                  name="criteria.coursesIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Курсы</FormLabel>
                      <FormControl>
                        <Input placeholder="Курсы" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="criteria.minPrice"
                  render={() => (
                    <FormItem>
                      <FormLabel>Минимальная цена курса</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Минимальная цена курса"
                          {...form.register('criteria.minPrice', {
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
                  name="criteria.maxPrice"
                  render={() => (
                    <FormItem>
                      <FormLabel>Максимальная цена курса</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Максимальная цена курса"
                          {...form.register('criteria.maxPrice', {
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
                  name="criteria.requiredRank"
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
              </div>
            )}
            {type === 'COURSE_REGISTRATION' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Регистрация в курсах</h3>
                <FormField
                  control={form.control}
                  name="criteria.coursesIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Курсы</FormLabel>
                      <FormControl>
                        <Input placeholder="Курсы" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="criteria.minPrice"
                  render={() => (
                    <FormItem>
                      <FormLabel>Минимальная цена курса</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Минимальная цена курса"
                          {...form.register('criteria.minPrice', {
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
                  name="criteria.maxPrice"
                  render={() => (
                    <FormItem>
                      <FormLabel>Максимальная цена курса</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Максимальная цена курса"
                          {...form.register('criteria.maxPrice', {
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
                  name="criteria.requiredRank"
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
              </div>
            )}
            {type === 'PARTICIPATION_LIMIT' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Попадание в число первых</h3>
                <FormField
                  control={form.control}
                  name="criteria.maxParticipants"
                  render={() => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Максимальное число пользователей"
                          {...form.register('criteria.maxParticipants', {
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
                  name="criteria.requiredRank"
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
              </div>
            )}
            {type === 'SUBSCRIPTION' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Подписка</h3>
                <FormField
                  control={form.control}
                  name="criteria.tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Вид</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                                value="PRO"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">PRO</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                                value="PREMIUM"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">PREMIUM</FormLabel>
                          </FormItem>
                        </RadioGroup>
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
                      <FormLabel>Срок</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                                value="MONTHLY"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">MONTHLY</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                                value="YEARLY"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">YEARLY</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="criteria.amount"
                  render={() => (
                    <FormItem>
                      <FormLabel>Количество</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Количество"
                          {...form.register('criteria.maxParticipants', {
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
                  name="criteria.firstTimeOnly"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 py-4">
                      <FormControl>
                        <Checkbox
                          className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Только для впервые оформляющих</FormLabel>
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
