'use client';

import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { IAchievement } from '../libs/interfaces/interfaces';
import { achievementsFiltersSchema } from '../libs/validation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { Checkbox } from './checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';
import RangeSlider from './range-slider';
import { ranks } from '../libs/utils/static-data';

type TAchievementsFiltersProps = {
  achievements: IAchievement[];
  filterAchievements: Dispatch<SetStateAction<IAchievement[]>>;
};

const AchievementsFilters: FC<TAchievementsFiltersProps> = ({ achievements, filterAchievements }) => {
  const [range, setRange] = useState([20, 80]);
  const [filteredAchievements, setFilteredAchievements] = useState<IAchievement[]>(achievements);

  const form = useForm<z.infer<typeof achievementsFiltersSchema>>({
    resolver: zodResolver(achievementsFiltersSchema),
    defaultValues: {
      language: 'JavaScript',
      rank: ['D-'],
    },
  });

  const onSubmit = (values: z.infer<typeof achievementsFiltersSchema>) => {
    const result = achievements.filter((achievements) => {
      return (
        achievements.language === values.language &&
        values.rank.includes(achievements.requiredRank) &&
        range[0] <= achievements.discount &&
        achievements.discount <= range[1]
      );
    });

    setFilteredAchievements(result);
    filterAchievements(result);
  };

  console.log('ACHIEVEMENT FILTERS');

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
        <RangeSlider title="Скидка" range={range} setRange={setRange} />
        <Button variant="custom" className="mr-5">
          Применить
        </Button>
        {achievements !== filteredAchievements && (
          <Button
            type="button"
            className="mr-auto my-4"
            variant="custom"
            onClick={() => {
              filterAchievements(achievements);
              setFilteredAchievements(achievements);
            }}
          >
            Сбросить фильтр
          </Button>
        )}
      </form>
    </Form>
  );
};

export default AchievementsFilters;
