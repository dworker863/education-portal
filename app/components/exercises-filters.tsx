'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC, Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { ranks } from '../libs/utils/static-data';
import { exercisesFiltersSchema } from '../libs/validation';
import RangeSlider from './range-slider';
import { Button } from './button';
import { IExercise } from '../libs/interfaces/interfaces';

type TExercisesFiltersProps = {
  exercises: IExercise[];
  setFilterExercises: Dispatch<SetStateAction<IExercise[]>>;
};

const ExercisesFilters: FC<TExercisesFiltersProps> = ({ exercises, setFilterExercises }) => {
  const [range, setRange] = useState([20, 80]);
  const [filteredExercises, setFilteredExercises] = useState<IExercise[]>(exercises);

  const form = useForm<z.infer<typeof exercisesFiltersSchema>>({
    resolver: zodResolver(exercisesFiltersSchema),
    defaultValues: {
      language: 'JavaScript',
      rank: ['D-'],
    },
  });

  const onSubmit = (values: z.infer<typeof exercisesFiltersSchema>) => {
    const result = exercises.filter((exercise) => {
      return (
        exercise.language === values.language &&
        values.rank.includes(exercise.requiredRank) &&
        range[0] <= exercise.prizePoints &&
        exercise.prizePoints <= range[1]
      );
    });

    setFilteredExercises(result);
    setFilterExercises(result);
  };

  return (
    <Form {...form}>
      <form className="mb-5 w-2/3" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Язык программирования</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="w-[300px]">
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите язык программирования" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Go">Go</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="mb-10">
          <FormField
            control={form.control}
            name="rank"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel className="text-base">Уровень</FormLabel>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-3 w-[200px] mb-10">
                  {ranks.map((rank) => (
                    <FormField
                      key={rank.id}
                      control={form.control}
                      name="rank"
                      render={({ field }) => {
                        return (
                          <FormItem key={rank.id} className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                                checked={field.value?.includes(rank.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, rank.id])
                                    : field.onChange(field.value?.filter((value) => value !== rank.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal leading-[18px]">{rank.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>
        <RangeSlider title="Баллы" range={range} setRange={setRange} />
        <Button variant="custom" className="mr-5">
          Применить
        </Button>
        {exercises !== filteredExercises && (
          <Button
            type="button"
            className="mr-auto my-4"
            variant="custom"
            onClick={() => {
              setFilterExercises(exercises);
              setFilteredExercises(exercises);
            }}
          >
            Сбросить фильтр
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ExercisesFilters;
