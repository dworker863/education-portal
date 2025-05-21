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
import { criteriaTypes, languages, ranks } from '../libs/utils/static-data';
import { getDaysUntilDate } from '../libs/utils/filters';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { getCoursesNames } from '../libs/server-actions/courses-actions';

type TAchievementsFiltersProps = {
  achievements: IAchievement[];
  filterAchievements: Dispatch<SetStateAction<IAchievement[]>>;
};

const CourseCompletionFilters = ({
  form,
  prefix,
  coursesNames,
  prices,
  setPrices,
}: {
  form: UseFormReturn<any>;
  prefix: string;
  coursesNames: ICoursePartial[] | null;
  prices: number[];
  setPrices: Dispatch<React.SetStateAction<number[]>>;
}) => {
  return (
    <div className="mb-10 space-y-4">
      <FormField
        control={form.control}
        name={`${prefix}.coursesNames`}
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
                  name={`${prefix}.${index}.coursesNames`}
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
        title="Цена"
        maxValue={500}
        minValueText={`Минимальная цена ${prices[0]}`}
        maxValueText={`Минимальная цена ${prices[1]}`}
        range={prices}
        setRange={setPrices}
      />
      <div className="mb-10">
        <FormField
          control={form.control}
          name={`${prefix}.requiredRank`}
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
                    name={`${prefix}.${index}.requiredRank`}
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

const ExerciseCompletionFilters = ({
  form,
  prefix,
  amount,
  setAmount,
  pointsToComplete,
  setPointsToComplete,
}: {
  form: UseFormReturn<any>;
  prefix: string;
  amount: number[];
  setAmount: Dispatch<React.SetStateAction<number[]>>;
  pointsToComplete: number[];
  setPointsToComplete: Dispatch<React.SetStateAction<number[]>>;
}) => {
  return (
    <div className="mb-10 space-y-8">
      <RangeSlider
        title="Количество упражнений"
        maxValue={50}
        minValueText={`От ${amount[0]}`}
        maxValueText={`До ${amount[1]}`}
        range={amount}
        setRange={setAmount}
      />
      <div className="mb-10">
        <FormField
          control={form.control}
          name={`${prefix}.language`}
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">Язык программирования</FormLabel>
              </div>
              <div className="flex flex-col gap-y-3 w-[200px] mb-10">
                {languages.map((language, index) => (
                  <FormField
                    key={language.id + index}
                    control={form.control}
                    name={`${prefix}.${index}.language`}
                    render={({ field }) => {
                      const values = field.value || [];

                      return (
                        <FormItem key={language.id + index} className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                              checked={values.includes(language.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...values, language.id])
                                  : field.onChange(values.filter((value: string) => value !== language.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal leading-[18px]">{language.label}</FormLabel>
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

      <RangeSlider
        title="Количество необходимых баллов для завершения"
        maxValue={500}
        minValueText={`От ${pointsToComplete[0]} баллов`}
        maxValueText={`До ${pointsToComplete[1]} баллов`}
        range={pointsToComplete}
        setRange={setPointsToComplete}
      />
      <div className="mb-10">
        <FormField
          control={form.control}
          name={`${prefix}.requiredRank`}
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
                    name={`${prefix}.${index}.requiredRank`}
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

const ParticipationLimitFilters = ({
  form,
  prefix,
  maxParticipants,
  setMaxParticipants,
}: {
  form: UseFormReturn<any>;
  prefix: string;
  maxParticipants: number[];
  setMaxParticipants: Dispatch<React.SetStateAction<number[]>>;
}) => {
  return (
    <div className="mb-10 space-y-8">
      <RangeSlider
        title="Количество призовых мест"
        maxValue={10000}
        minValueText={`От ${maxParticipants[0]} человек`}
        maxValueText={`До ${maxParticipants[1]} человек`}
        range={maxParticipants}
        setRange={setMaxParticipants}
      />
      <div className="mb-10">
        <FormField
          control={form.control}
          name={`${prefix}.requiredRank`}
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
                    name={`${prefix}.${index}.requiredRank`}
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

const SubscriptionFilters = ({
  form,
  prefix,
  monthes,
  setMonthes,
}: {
  form: UseFormReturn<any>;
  prefix: string;
  monthes: number[];
  setMonthes: Dispatch<React.SetStateAction<number[]>>;
}) => {
  return (
    <div className="mb-10 space-y-8">
      <div className="mb-10">
        <FormField
          control={form.control}
          name="rewardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Вид подписки</FormLabel>
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
      </div>
      <RangeSlider
        title="Срок"
        maxValue={12}
        minValueText={`От ${monthes[0]} месяцев/лет`}
        maxValueText={`До ${monthes[1]} месяцев/лет`}
        range={monthes}
        setRange={setMonthes}
      />
      <div className="mb-10">
        <FormField
          control={form.control}
          name={`${prefix}.tier`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Вид подписки</FormLabel>
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
                    <FormLabel className="font-normal">Месяцев</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                        value="YEARLY"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Лет</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mb-10">
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const CombinationFilters = ({ form, prefix }: { form: UseFormReturn<any>; prefix: string }) => {
  return (
    <div className="mb-10 space-y-8">
      <div className="mb-10">
        <FormField
          control={form.control}
          name={`${prefix}.operator`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Оператор</FormLabel>
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
                    <FormLabel className="font-normal">Или</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary data-[state=checked]:text-primary-foreground"
                        value="OR"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">И</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mb-10">
        <FormField
          control={form.control}
          name={`${prefix}.types`}
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">Тип достижения</FormLabel>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-3 w-[200px] mb-10">
                {criteriaTypes.map((type, index) => (
                  <FormField
                    key={type.id + index}
                    control={form.control}
                    name={`${prefix}.${index}.types`}
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
                                  : field.onChange(values.filter((value: string) => value !== type.id));
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

      <div className="mb-10">
        <FormField
          control={form.control}
          name={`${prefix}.requiredRank`}
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
                    name={`${prefix}.${index}.requiredRank`}
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
  const [amount, setAmount] = useState([0, 10]);
  const [pointsToComplete, setPointsToComplete] = useState([0, 100]);
  const [maxParticipants, setMaxParticipants] = useState([0, 1000]);
  const [monthes, setMonthes] = useState([0, 5]);
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
  const criteriaTypeFilters = form.watch('criteriaTypeFilters');

  console.log('FILTERS FORM: ', typeof criteriaTypeFilters);

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
      <form className="mb-5 w-2/3 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FormLabel className="text-base">Тип достижения</FormLabel>
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
          <CourseCompletionFilters
            form={form}
            prefix="criteriaTypeFilters"
            coursesNames={coursesNames}
            prices={prices}
            setPrices={setPrices}
          />
        )}
        {criteriaType?.includes('EXERCISE_COMPLETION') && (
          <ExerciseCompletionFilters
            form={form}
            prefix="criteriaTypeFilters"
            amount={amount}
            setAmount={setAmount}
            pointsToComplete={pointsToComplete}
            setPointsToComplete={setPointsToComplete}
          />
        )}
        {criteriaType?.includes('PARTICIPATION_LIMIT') && (
          <ParticipationLimitFilters
            form={form}
            prefix="criteriaTypeFilters"
            maxParticipants={maxParticipants}
            setMaxParticipants={setMaxParticipants}
          />
        )}
        {criteriaType?.includes('SUBSCRIPTION') && (
          <SubscriptionFilters form={form} prefix="criteriaTypeFilters" monthes={monthes} setMonthes={setMonthes} />
        )}
        {criteriaType?.includes('COMBINATION') && <CombinationFilters form={form} prefix="criteriaTypeFilters" />}
        {criteriaType?.includes('COMBINATION') &&
          criteriaTypeFilters.map((filter, index) => {
            if ('operator' in filter) {
              return (
                filter.types?.includes('EXERCISE_COMPLETION') && (
                  <ExerciseCompletionFilters
                    key={index}
                    form={form}
                    prefix={`criteriaTypeFilters.conditions.${index}`}
                    amount={amount}
                    setAmount={setAmount}
                    pointsToComplete={pointsToComplete}
                    setPointsToComplete={setPointsToComplete}
                  />
                )
              );
            }
            return null;
          })}
        {criteriaType?.includes('COMBINATION') &&
          criteriaTypeFilters.map((filter, index) => {
            if ('operator' in filter) {
              return (
                (filter.types?.includes('COURSE_COMPLETION') || filter.types?.includes('COURSE_REGISTRATION')) && (
                  <ExerciseCompletionFilters
                    key={index}
                    form={form}
                    prefix={`criteriaTypeFilters.conditions.${index}`}
                    amount={amount}
                    setAmount={setAmount}
                    pointsToComplete={pointsToComplete}
                    setPointsToComplete={setPointsToComplete}
                  />
                )
              );
            }
            return null;
          })}
        {criteriaType?.includes('COMBINATION') &&
          criteriaTypeFilters.map((filter, index) => {
            if ('operator' in filter) {
              return (
                filter.types?.includes('PARTICIPATION_LIMIT') && (
                  <ExerciseCompletionFilters
                    key={index}
                    form={form}
                    prefix={`criteriaTypeFilters.conditions.${index}`}
                    amount={amount}
                    setAmount={setAmount}
                    pointsToComplete={pointsToComplete}
                    setPointsToComplete={setPointsToComplete}
                  />
                )
              );
            }
            return null;
          })}
        {criteriaType?.includes('COMBINATION') &&
          criteriaTypeFilters.map((filter, index) => {
            if ('operator' in filter) {
              return (
                filter.types?.includes('SUBSCRIPTION') && (
                  <ExerciseCompletionFilters
                    key={index}
                    form={form}
                    prefix={`criteriaTypeFilters.conditions.${index}`}
                    amount={amount}
                    setAmount={setAmount}
                    pointsToComplete={pointsToComplete}
                    setPointsToComplete={setPointsToComplete}
                  />
                )
              );
            }
            return null;
          })}
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
