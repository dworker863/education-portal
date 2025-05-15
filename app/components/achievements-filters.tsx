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
import { criteriaTypes, ranks } from '../libs/utils/static-data';
import { getDaysUntilDate } from '../libs/utils/filters';

type TAchievementsFiltersProps = {
  achievements: IAchievement[];
  filterAchievements: Dispatch<SetStateAction<IAchievement[]>>;
};

const AchievementsFilters: FC<TAchievementsFiltersProps> = ({ achievements, filterAchievements }) => {
  const [range, setRange] = useState([0, 30]);
  const [filteredAchievements, setFilteredAchievements] = useState<IAchievement[]>(achievements);

  const form = useForm<z.infer<typeof achievementsFiltersSchema>>({
    resolver: zodResolver(achievementsFiltersSchema),
    defaultValues: {
      criteriaType: ['COURSE_COMPLETION'],
      // language: 'JavaScript',
      // rank: ['D-'],
      // courseName: ['test'],
    },
  });

  const onSubmit = (values: z.infer<typeof achievementsFiltersSchema>) => {
    const result = achievements.filter((achievement) => {
      // console.log('FILTER: ', getDaysUntilDate(achievement.startDate));

      return (
        getDaysUntilDate(achievement.startDate) >= range[0] &&
        (achievement.endDate ? getDaysUntilDate(achievement.endDate) : range[1]) <= range[1]
      );
    });
    // const result = achievements.filter((achievement) => {
    //   return (
    //     achievement.language === values.language &&
    //     values.rank &&
    //     values.rank.includes(achievement.requiredRank) &&
    //     achievement.course &&
    //     values.courseName &&
    //     values.courseName.includes(achievement.course?.name) &&
    //     range[0] <= achievement.discount &&
    //     achievement.discount <= range[1]
    //   );
    // });
    setFilteredAchievements(result);
    filterAchievements(result);
  };

  return (
    <Form {...form}>
      <form className="mb-5 w-2/3" onSubmit={form.handleSubmit(onSubmit)}>
        {/* <div className="mb-10">
          <FormField
            control={form.control}
            name="criteriaType"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel className="text-base">Уровень</FormLabel>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-3 w-[200px] mb-10">
                  {criteriaTypes.map((type, index) => (
                    <FormField
                      key={type.id + index}
                      control={form.control}
                      name="criteriaType"
                      render={({ field }) => {
                        const values = field.value || [];

                        return (
                          <FormItem key={type.id + index} className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                                checked={values.includes(type.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...values, type.id])
                                    : field.onChange(values.filter((value) => value !== type.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal leading-[18px]">{type.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div> */}
        {/* <div className="mb-10">
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
        </div> */}
        {/* <div className="mb-10">
          <FormField
            control={form.control}
            name="rank"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel className="text-base">Уровень</FormLabel>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-3 w-[200px] mb-10">
                  {ranks.map((rank, index) => (
                    <FormField
                      key={rank.id + index}
                      control={form.control}
                      name="rank"
                      render={({ field }) => {
                        const values = field.value || [];

                        return (
                          <FormItem key={rank.id + index} className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                                checked={values.includes(rank.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...values, rank.id])
                                    : field.onChange(values.filter((value) => value !== rank.id));
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
        </div> */}
        {/* <div className="mb-10">
          <FormField
            control={form.control}
            name="courseName"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel className="text-base">Курсы</FormLabel>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-3 w-[200px] mb-10">
                  {achievements.map(({ course }, index) => (
                    <FormField
                      key={course ? index + course?.name : index}
                      control={form.control}
                      name="courseName"
                      render={({ field }) => {
                        const value = field.value || [];
                        return (
                          <FormItem
                            key={course ? index + course?.name : index}
                            className="flex flex-row items-start space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                                checked={course && value.includes(course?.name)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...value, course?.name])
                                    : field.onChange(value.filter((value) => value !== course?.name));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal leading-[18px]">{course?.name}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div> */}
        {/* <RangeSlider title="Скидка" range={range} setRange={setRange} /> */}
        <RangeSlider title="Сроки" range={range} setRange={setRange} />
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
