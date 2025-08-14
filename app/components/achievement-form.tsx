'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { FC, memo, useMemo, useState, useTransition } from 'react';
import { Controller, useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
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
import { criteriaTypes } from '../libs/utils/static-data';

type TAchievementFormProps = {
  mode: 'create' | 'edit';
  achievementId?: string;
};

const ExerciseCompletionFields = ({ form, prefix = '' }: { form: UseFormReturn<any>; prefix: string }) => {
  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h3 className="font-medium">Выполнение упражнений</h3>
      <FormField
        control={form.control}
        name={`${prefix}.count`}
        render={() => (
          <FormItem>
            <FormLabel>Колличество упражнений</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Колличество упражнений"
                {...form.register(`${prefix}.count`, {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.language`}
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
        name={`${prefix}.pointsToComplete`}
        render={() => (
          <FormItem>
            <FormLabel>Колличество баллов</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Колличество призовых баллов"
                {...form.register(`${prefix}.pointsToComplete`, {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.requiredRank`}
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
  );
};

const CourseCompletionFields = ({ form, prefix = '' }: { form: UseFormReturn<any>; prefix: string }) => {
  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h3 className="font-medium">Завершение курсов</h3>
      <FormField
        control={form.control}
        name={`${prefix}.courseNames`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Курсы</FormLabel>
            <FormControl>
              <Input
                placeholder="Введите id курсов через запятую"
                {...form.register(`${prefix}.courseNames`, {
                  setValueAs: (value) =>
                    typeof value === 'string' && value !== '' ? value.split(',').map((item) => item.trim()) : [],
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.minPrice`}
        render={() => (
          <FormItem>
            <FormLabel>Минимальная цена курса</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Минимальная цена курса"
                {...form.register(`${prefix}.minPrice`, {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.maxPrice`}
        render={() => (
          <FormItem>
            <FormLabel>Максимальная цена курса</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Максимальная цена курса"
                {...form.register(`${prefix}.maxPrice`, {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.requiredRank`}
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
  );
};

const CourseRegistrationFields = ({ form, prefix = '' }: { form: UseFormReturn<any>; prefix: string }) => {
  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h3 className="font-medium">Регистрация в курсах</h3>
      <FormField
        control={form.control}
        name={`${prefix}.courseNames`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Курсы</FormLabel>
            <FormControl>
              <Input
                placeholder="Курсы"
                {...form.register(`${prefix}.courseNames`, {
                  setValueAs: (value) =>
                    typeof value === 'string' && value !== '' ? value.split(',').map((item) => item.trim()) : [],
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.minPrice`}
        render={() => (
          <FormItem>
            <FormLabel>Минимальная цена курса</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Минимальная цена курса"
                {...form.register(`${prefix}.minPrice`, {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.maxPrice`}
        render={() => (
          <FormItem>
            <FormLabel>Максимальная цена курса</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Максимальная цена курса"
                {...form.register(`${prefix}.maxPrice`, {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.requiredRank`}
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
  );
};

const ParticipationLimitFields = ({
  form,
  prefix = '',
  mode,
}: {
  form: UseFormReturn<any>;
  prefix: string;
  mode: 'create' | 'edit';
}) => {
  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h3 className="font-medium">Попадание в число первых</h3>
      <FormField
        control={form.control}
        name={`${prefix}.maxParticipants`}
        render={() => (
          <FormItem>
            <FormLabel>Макс. количество участников</FormLabel>
            {mode === 'create' && <RequiredSign />}
            <FormControl>
              <Input
                type="number"
                placeholder="Максимальное количество участников"
                {...form.register(`${prefix}.maxParticipants`, {
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
        name={`${prefix}.requiredRank`}
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
  );
};

const SubscriptionFields = ({
  form,
  prefix = '',
  mode,
}: {
  form: UseFormReturn<any>;
  prefix: string;
  mode: 'create' | 'edit';
}) => {
  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h3 className="font-medium">Подписка</h3>
      <FormField
        control={form.control}
        name={`${prefix}.tier`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Вид</FormLabel>
            {mode === 'create' && <RequiredSign />}
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
        name={`${prefix}.amount`}
        render={() => (
          <FormItem>
            <FormLabel>Количество</FormLabel>
            {mode === 'create' && <RequiredSign />}
            <FormControl>
              <Input
                type="number"
                placeholder="Количество месяцев"
                {...form.register(`${prefix}.amount`, {
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
        name={`${prefix}.firstTimeOnly`}
        render={({ field }) => (
          <FormItem className="flex items-center space-y-0 py-4">
            <FormControl className="mr-3">
              <Checkbox
                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Только для впервые оформляющих</FormLabel>
            {mode === 'create' && <RequiredSign />}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const AchievementForm: FC<TAchievementFormProps> = ({ mode, achievementId }) => {
  const [isPending, startTransiton] = useTransition();
  const router = useRouter();

  const schema = useMemo(() => (mode === 'create' ? createAchievementSchema : editAchievementSchema), [mode]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(mode === 'create' ? false : true);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: mode === 'create' ? '' : undefined,
      description: mode === 'create' ? '' : undefined,
      icon: null,
      startDate: mode === 'create' ? new Date() : undefined,
      endDate: undefined,
      criteria:
        mode === 'create'
          ? {
              type: 'COURSE_COMPLETION',
            }
          : undefined,
      reward:
        mode === 'create'
          ? {
              type: 'SUBSCRIPTION',
              icon: null,
              amount: 1,
            }
          : undefined,
    },
  });

  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeConfition,
  } = useFieldArray({ control: form.control, name: 'criteria.conditions' });

  const addCondition = (
    type: 'EXERCISE_COMPLETION' | 'COURSE_COMPLETION' | 'COURSE_REGISTRATION' | 'PARTICIPATION_LIMIT' | 'SUBSCRIPTION',
  ) => {
    switch (type) {
      case 'EXERCISE_COMPLETION':
        appendCondition({
          type: 'EXERCISE_COMPLETION',
          count: 0,
          language: '',
          pointsToComplete: 0,
          requiredRank: '',
        });
        break;

      case 'COURSE_COMPLETION':
        appendCondition({
          type: 'COURSE_COMPLETION',
          courseNames: [],
          minPrice: 0,
          maxPrice: 0,
          requiredRank: '',
        });
        break;

      case 'COURSE_REGISTRATION':
        appendCondition({
          type: 'COURSE_REGISTRATION',
          courseNames: [],
          minPrice: 0,
          maxPrice: 0,
          requiredRank: '',
        });
        break;

      case 'PARTICIPATION_LIMIT':
        appendCondition({
          type: 'PARTICIPATION_LIMIT',
          maxParticipants: 0,
          requiredRank: '',
        });
        break;

      case 'SUBSCRIPTION':
        appendCondition({
          type: 'SUBSCRIPTION',
          tier: 'PRO',
          amount: 0,
          firstTimeOnly: false,
        });
        break;

      default:
        const _exhaustiveCheck: never = type;
        return _exhaustiveCheck;
    }
  };

  const criteriaType = form.watch('criteria.type');
  const rewardType = form.watch('reward.type');
  const combinationTypes = form.watch('criteria.types');

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log('ACHIEVEMENT FORM:', values);

    startTransiton(async () => {
      try {
        const formData = new FormData();

        if (achievementId) {
          formData.append('id', achievementId);
        }

        if (values.reward && values.reward.type) {
          const { icon, ...rewardData } = values.reward;

          formData.append('reward', JSON.stringify(rewardData));

          if (icon) {
            formData.append('reward.icon', icon[0]);
            console.log('ACHIEVEMENT FORM: ', formData.get('reward.icon'));
          }
        }

        if (values.criteria && values.criteria.type) {
          formData.append('criteria', JSON.stringify(values.criteria));
        }

        for (const key in values) {
          const value = values[key as keyof typeof values];
          if (key !== 'reward' && key !== 'criteria' && key !== 'icon' && value !== undefined) {
            formData.append(key, value);
          }
        }

        if (values.icon) {
          formData.append('icon', values.icon[0]);
        }
        const formDataObj = Object.fromEntries(formData.entries());
        console.log('ACHIEVEMENT FORM:', formDataObj);

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
        setSuccess(null);
        console.error('Ошибка при выполнении запроса:', error);
        setError('Что-то пошло не так. Попробуйте снова.');
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
                <FormItem>
                  <FormLabel>Дата начала</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="w-full">
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
                        disabled={(date) => {
                          const today = new Date();
                          const maxDate = new Date();
                          maxDate.setDate(today.getDate() + 30);
                          return date < today || date > maxDate;
                        }}
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
                  <FormLabel>Дата окончания</FormLabel>
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
                        disabled={(date) => {
                          const startDate = form.getValues('startDate');
                          if (!startDate) return true;

                          const minDate = new Date(startDate);
                          const maxDate = new Date(startDate);
                          maxDate.setDate(maxDate.getDate() + 180);

                          return date < minDate || date > maxDate;
                        }}
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
                  {mode === 'create' && <RequiredSign />}
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
                      <SelectItem value="COMBINATION">COMBINATION</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {criteriaType === 'COMBINATION' && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium">Комбинированное условие</h3>
                <FormField
                  control={form.control}
                  name="criteria.operator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Вид</FormLabel>
                      {mode === 'create' && <RequiredSign />}
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
                                value="AND"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">AND</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                                value="OR"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">OR</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Тип достижения</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  {criteriaTypes.map((type, index) => (
                    <FormField
                      key={type.id + index}
                      control={form.control}
                      name="criteria.types"
                      render={({ field }) => {
                        const values = field.value || [];

                        return (
                          <FormItem className="flex items-center space-x-3 space-y-0 py-1">
                            <FormControl>
                              <Checkbox
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                                checked={values.includes(type.id)}
                                onCheckedChange={(checked) => {
                                  addCondition(type.id);
                                  return checked
                                    ? field.onChange([...values, type.id])
                                    : field.onChange(values?.filter((value) => value !== type.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel>{type.label}</FormLabel>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </FormItem>
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
                {conditionFields.map((field, index) => (
                  <div key={field.id}>
                    {field.type === 'EXERCISE_COMPLETION' && (
                      <ExerciseCompletionFields form={form} prefix={`criteria.conditions.${index}`} />
                    )}
                    {field.type === 'COURSE_COMPLETION' && (
                      <CourseCompletionFields form={form} prefix={`criteria.conditions.${index}`} />
                    )}
                    {field.type === 'COURSE_REGISTRATION' && (
                      <CourseRegistrationFields form={form} prefix={`criteria.conditions.${index}`} />
                    )}
                    {field.type === 'PARTICIPATION_LIMIT' && (
                      <ParticipationLimitFields form={form} prefix={`criteria.conditions.${index}`} mode={mode} />
                    )}
                    {field.type === 'SUBSCRIPTION' && (
                      <SubscriptionFields form={form} prefix={`criteria.conditions.${index}`} mode={mode} />
                    )}
                  </div>
                ))}
              </div>
            )}
            {criteriaType === 'EXERCISE_COMPLETION' && <ExerciseCompletionFields form={form} prefix="criteria" />}
            {criteriaType === 'COURSE_COMPLETION' && <CourseCompletionFields form={form} prefix="criteria" />}
            {criteriaType === 'COURSE_REGISTRATION' && <CourseRegistrationFields form={form} prefix="criteria" />}
            {criteriaType === 'PARTICIPATION_LIMIT' && (
              <ParticipationLimitFields form={form} prefix="criteria" mode={mode} />
            )}
            {criteriaType === 'SUBSCRIPTION' && <SubscriptionFields form={form} prefix="criteria" mode={mode} />}

            <div className="space-y-4 border p-4 rounded-lg">
              <h3 className="font-medium">Награда</h3>
              <FormField
                control={form.control}
                name="reward.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вид</FormLabel>
                    {mode === 'create' && <RequiredSign />}
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
                              value="DISCOUNT"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">DISCOUNT</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                              value="SUBSCRIPTION"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">SUBSCRIPTION</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name="reward.icon"
                render={({ field }) => (
                  <FormItem className="w-[275px]">
                    <FormLabel>Иконка награды</FormLabel>
                    {mode === 'create' && <RequiredSign />}
                    <FormControl>
                      <Dropzone
                        onDrop={(acceptedFiles) => {
                          form.setValue('reward.icon', acceptedFiles, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section className="container ">
                            <div {...getRootProps({ className: 'dropzone disabled' })}>
                              <input type="file" accept="image/*" {...getInputProps()} />
                              <div className=" flex flex-col items-center gap-4 w-fit min-w-[275px] px-10 py-6 border border-customPrimary rounded-lg cursor-pointer text-base text-muted-foreground ">
                                <p className=" text-muted-foreground text">Загрузите изображение</p>
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
                    {form.formState.errors.reward?.icon && (
                      <p className="text-destructive text-sm mt-2">
                        {form.formState.errors.reward.icon.message as string}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reward.amount"
                render={() => (
                  <FormItem>
                    <FormLabel>{rewardType === 'SUBSCRIPTION' ? 'Количество месяцев' : 'Количество билетов'}</FormLabel>
                    {mode === 'create' && <RequiredSign />}
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Количество"
                        {...form.register('reward.amount', {
                          valueAsNumber: mode === 'create',
                          setValueAs: (value) => (value === '' ? undefined : Number(value)),
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default memo(AchievementForm);
