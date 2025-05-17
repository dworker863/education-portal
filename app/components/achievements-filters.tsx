'use client';

import React, { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { IAchievement, ICoursePartial } from '../libs/interfaces/interfaces';
import { achievementsFiltersSchema } from '../libs/validation';
import { z } from 'zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Checkbox } from './checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';
import RangeSlider from './range-slider';
import { criteriaTypes, ranks } from '../libs/utils/static-data';
import { getDaysUntilDate } from '../libs/utils/filters';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { getCoursesNames } from '../libs/server-actions/courses-actions';

type TAchievementsFiltersProps = {
  achievements: IAchievement[];
  filterAchievements: Dispatch<SetStateAction<IAchievement[]>>;
};

const CourseCompletionFilters = ({
  form,
  coursesNames,
  range,
  setRange,
}: {
  form: UseFormReturn<any>;
  coursesNames: ICoursePartial[] | null;
  range: number[];
  setRange: Dispatch<React.SetStateAction<number[]>>;
}) => {
  return (
    <div className="mb-10 space-y-4">
      <FormField
        control={form.control}
        name="criteriaTypeFilters"
        render={() => (
          <FormItem>
            <div className="mb-2">
              <FormLabel className="text-base">Названия курсов</FormLabel>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-3 w-[200px] mb-10">
              {coursesNames?.map((course, index) => (
                <FormField
                  key={course.id + index}
                  control={form.control}
                  name={`criteriaTypeFilters.${index}.coursesNames`}
                  render={({ field }) => {
                    const values = field.value || [];

                    return (
                      <FormItem key={course.id + index} className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                            checked={values.includes(course.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...values, course.id])
                                : field.onChange(values.filter((value: string) => value !== course.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal leading-[18px]">{course.name}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
      <RangeSlider
        title="Сроки"
        maxValue={500}
        minValueText={`Минимальная цена ${range[0]}`}
        maxValueText={`Минимальная цена ${range[1]}`}
        range={range}
        setRange={setRange}
      />
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
                                  : field.onChange(values.filter((value: string) => value !== rank.id));
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
    </div>
  );
};

const AchievementsFilters: FC<TAchievementsFiltersProps> = ({ achievements, filterAchievements }) => {
  const [days, setDays] = useState([0, 30]);
  const [prices, setPrices] = useState([0, 100]);
  const [coursesNames, setCoursesNames] = useState<ICoursePartial[] | null>(null);
  const [filteredAchievements, setFilteredAchievements] = useState<IAchievement[]>(achievements);

  useEffect(() => {
    getCoursesNames().then((courses) => {
      setCoursesNames(courses);
    });
  }, []);

  const form = useForm<z.infer<typeof achievementsFiltersSchema>>({
    resolver: zodResolver(achievementsFiltersSchema),
    defaultValues: {
      criteriaType: ['COURSE_COMPLETION'],
      // rank: ['D-'],
      // courseName: ['test'],
    },
  });

  const criteriaType = form.watch('criteriaType');

  const onSubmit = (values: z.infer<typeof achievementsFiltersSchema>) => {
    const result = achievements.filter((achievement) => {
      // console.log('FILTER: ', getDaysUntilDate(achievement.startDate));

      if (values.rewardType && typeof achievement.reward === 'object' && !Array.isArray(achievement.reward)) {
        return (
          achievement.reward?.type === values.rewardType &&
          getDaysUntilDate(achievement.startDate) >= days[0] &&
          (achievement.endDate ? getDaysUntilDate(achievement.endDate) : days[1]) <= days[1]
        );
      }

      return (
        getDaysUntilDate(achievement.startDate) >= days[0] &&
        (achievement.endDate ? getDaysUntilDate(achievement.endDate) : days[1]) <= days[1]
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

        {/* <RangeSlider title="Скидка" range={range} setRange={setRange} /> */}
        <RangeSlider
          title="Сроки"
          maxValue={180}
          minValueText={`Начало через ${days[0]} дней`}
          maxValueText={`Окончание через ${days[1]} дней`}
          range={days}
          setRange={setDays}
        />
        <div className="mb-10">
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
        </div>
        {(criteriaType?.includes('COURSE_REGISTRATION') || criteriaType?.includes('COURSE_COMPLETION')) && (
          <CourseCompletionFilters form={form} coursesNames={coursesNames} range={prices} setRange={setPrices} />
        )}
        <div className="mb-10">
          <FormField
            control={form.control}
            name="rewardType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">Награда</FormLabel>
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
                      <FormLabel className="font-normal">Скидка</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                          value="SUBSCRIPTION"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Подписка</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
