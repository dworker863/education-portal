'use client';

import { Dispatch, FC, SetStateAction, useState, useEffect, memo } from 'react';
import { IAchievement, ICoursePartial, TCriteriaType } from '../libs/interfaces/interfaces';
import { achievementsFiltersSchema } from '../libs/validation';
import { z } from 'zod';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Checkbox } from './checkbox';
import { Button } from './button';
import RangeSlider from './range-slider';
import { criteriaTypes, languages, ranks } from '../libs/utils/static-data';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { getCourseNames } from '../libs/server-actions/courses-actions';
import { getDaysUntilDate, isObjectCriteria } from '../libs/utils/common';

const CourseCompletionFilters = ({
  form,
  prefix,
  courseNames,
  prices,
  setPrices,
}: {
  form: UseFormReturn<any>;
  prefix: string;
  courseNames: ICoursePartial[] | null;
  prices: number[];
  setPrices: Dispatch<SetStateAction<number[]>>;
}) => {
  return (
    <div className="mb-10 space-y-4">
      <h2 className="text-customSecondary text-lg">Окончание/старт курса</h2>
      <FormField
        control={form.control}
        name={`${prefix}.courseNames`}
        render={() => (
          <FormItem>
            <div className="mb-2">
              <FormLabel className="text-base">Названия курсов</FormLabel>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-3 w-[200px] mb-10">
              {courseNames?.map((course, index) => (
                <FormField
                  key={course.id + index}
                  control={form.control}
                  name={`${prefix}.courseNames`}
                  render={({ field }) => {
                    const values = field.value || [];

                    return (
                      <FormItem key={course.id + index} className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            className="w-5 h-5 bg-customPrimary data-[state=checked]:bg-customPrimary"
                            checked={values.includes(course.name)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...values, course.name])
                                : field.onChange(values.filter((value: string) => value !== course.name));
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
        maxValueText={`Максимальная цена ${prices[1]}`}
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
                    name={`${prefix}.requiredRank`}
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
  setAmount: Dispatch<SetStateAction<number[]>>;
  pointsToComplete: number[];
  setPointsToComplete: Dispatch<SetStateAction<number[]>>;
}) => {
  return (
    <div className="mb-10 space-y-8">
      <h2 className="text-customSecondary text-lg">Выполнение упражнений</h2>
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
          name={`${prefix}.languages`}
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
                    name={`${prefix}.languages`}
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
                    name={`${prefix}.requiredRank`}
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
  setMonthes: Dispatch<SetStateAction<number[]>>;
}) => {
  return (
    <div className="mb-10 space-y-8">
      <h2 className="text-customSecondary text-lg">Подписка</h2>

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
          name={`${prefix}.duration`}
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

type TAchievementsFiltersProps = {
  achievements: IAchievement[];
  setFilterAchievements: Dispatch<SetStateAction<IAchievement[]>>;
};

const AchievementsFilters: FC<TAchievementsFiltersProps> = ({ achievements, setFilterAchievements }) => {
  const [days, setDays] = useState<number[]>([0, 30]);
  const [prices, setPrices] = useState<number[]>([0, 100]);
  const [amount, setAmount] = useState<number[]>([0, 10]);
  const [pointsToComplete, setPointsToComplete] = useState<number[]>([0, 100]);
  const [monthes, setMonthes] = useState<number[]>([0, 5]);
  const [courseNames, setCoursesNames] = useState<ICoursePartial[] | null>(null);
  const [filteredAchievements, setFilteredAchievements] = useState<IAchievement[]>(achievements);

  useEffect(() => {
    let mounted = true;
    const loadCourseNames = async () => {
      try {
        const response = await getCourseNames();

        if (!mounted) return;

        setCoursesNames(response);
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };

    loadCourseNames();
    return () => {
      mounted = false;
    };
  }, []);

  const form = useForm<z.infer<typeof achievementsFiltersSchema>>({
    resolver: zodResolver(achievementsFiltersSchema),
    defaultValues: {
      criteriaType: [],
      criteriaTypeFilters: [],
      rewardType: undefined,
    },
  });

  const {
    fields: criteriaTypeFiltersFields,
    append: appendCriteriaTypeFilter,
    remove: removeCriteriaTypeFilter,
  } = useFieldArray({
    control: form.control,
    name: 'criteriaTypeFilters',
  });

  const addTypeFilter = (type: TCriteriaType) => {
    switch (type) {
      case 'EXERCISE_COMPLETION':
        appendCriteriaTypeFilter({
          type: 'EXERCISE_COMPLETION',
          languages: [],
          requiredRank: [],
        });
        break;

      case 'COURSE_COMPLETION':
        appendCriteriaTypeFilter({
          type: 'COURSE_COMPLETION',
          courseNames: [],
          requiredRank: [],
        });
        break;

      case 'COURSE_REGISTRATION':
        appendCriteriaTypeFilter({
          type: 'COURSE_REGISTRATION',
          courseNames: [],
          requiredRank: [],
        });
        break;

      case 'SUBSCRIPTION':
        appendCriteriaTypeFilter({
          type: 'SUBSCRIPTION',
          duration: undefined,
          firstTimeOnly: undefined,
        });
        break;

      default:
        const _exhaustiveCheck: never = type;
        return _exhaustiveCheck;
    }
  };

  const criteriaType = form.watch('criteriaType');
  const criteriaTypeFilters = form.watch('criteriaTypeFilters');

  const onSubmit = (values: z.infer<typeof achievementsFiltersSchema>) => {
    let result;

    if (days.length > 0) {
      result = achievements.filter(
        (achievement) =>
          typeof achievement.reward === 'object' &&
          !Array.isArray(achievement.reward) &&
          getDaysUntilDate(achievement.startDate) >= days[0] &&
          (achievement.endDate ? getDaysUntilDate(achievement.endDate) : days[1]) <= days[1],
      );
    }

    if (values.rewardType) {
      if (result) {
        result = (result || achievements).filter(
          (achievement) =>
            typeof achievement.reward === 'object' &&
            !Array.isArray(achievement.reward) &&
            achievement.reward?.type === values.rewardType,
        );
      }
    }

    if (values.criteriaType && values.criteriaType.length > 0) {
      result = achievements.filter(
        (achievement) =>
          isObjectCriteria(achievement.criteria) &&
          values.criteriaType!.includes(achievement.criteria.type as TCriteriaType),
      );
    }

    if (values.criteriaType?.includes('EXERCISE_COMPLETION')) {
      result = (result || achievements).filter(
        (achievement) =>
          isObjectCriteria(achievement.criteria) && achievement?.criteria?.type === 'EXERCISE_COMPLETION',
      );

      if (amount.length > 0) {
        result = (result || achievements).filter(
          (achievement) =>
            isObjectCriteria(achievement.criteria) &&
            (typeof achievement.criteria?.count === 'number' ? achievement.criteria?.count : amount[0]) >= amount[0] &&
            (typeof achievement.criteria?.count === 'number' ? achievement.criteria?.count : amount[1]) <= amount[1],
        );
      }

      if (
        values.criteriaTypeFilters?.some(
          (filter) => 'languages' in filter && filter.languages && filter.languages.length > 0,
        )
      ) {
        result = (result || achievements).filter((achievement) =>
          values.criteriaTypeFilters?.some((filter) => {
            return (
              'languages' in filter &&
              isObjectCriteria(achievement.criteria) &&
              typeof achievement.criteria?.language === 'string' &&
              filter.languages?.includes(achievement.criteria?.language)
            );
          }),
        );
      }

      if (pointsToComplete.length > 0) {
        result = (result || achievements).filter(
          (achievement) =>
            isObjectCriteria(achievement.criteria) &&
            (typeof achievement.criteria?.pointsToComplete === 'number'
              ? achievement.criteria?.pointsToComplete
              : pointsToComplete[0]) >= pointsToComplete[0] &&
            (typeof achievement.criteria?.pointsToComplete === 'number'
              ? achievement.criteria?.pointsToComplete
              : pointsToComplete[1]) <= pointsToComplete[1],
        );
      }

      if (
        values.criteriaTypeFilters?.some(
          (filter) => 'requiredRank' in filter && filter.requiredRank && filter.requiredRank.length > 0,
        )
      ) {
        result = (result || achievements).filter((achievement) =>
          values.criteriaTypeFilters?.some((filter) => {
            return (
              'requiredRank' in filter &&
              isObjectCriteria(achievement.criteria) &&
              typeof achievement.criteria?.requiredRank === 'string' &&
              filter.requiredRank?.includes(achievement.criteria?.requiredRank)
            );
          }),
        );
      }
    }

    if (values.criteriaType?.includes('COURSE_COMPLETION') || values.criteriaType?.includes('COURSE_REGISTRATION')) {
      if (
        values.criteriaTypeFilters?.some(
          (filter) => 'courseNames' in filter && filter.courseNames && filter.courseNames.length > 0,
        )
      ) {
        result = (result || achievements).filter((achievement) =>
          values.criteriaTypeFilters?.some((filter) => {
            return (
              'courseNames' in filter &&
              filter.courseNames?.some((name) => {
                return (
                  isObjectCriteria(achievement.criteria) &&
                  Array.isArray(achievement.criteria?.courseNames) &&
                  achievement.criteria?.courseNames?.includes(name)
                );
              })
            );
          }),
        );
      }

      if (prices.length > 0) {
        result = (result || achievements).filter(
          (achievement) =>
            isObjectCriteria(achievement.criteria) &&
            (typeof achievement.criteria?.minPrice === 'number' ? achievement.criteria?.minPrice : prices[0]) >=
              prices[0] &&
            (typeof achievement.criteria?.maxPrice === 'number' ? achievement.criteria?.maxPrice : prices[1]) <=
              prices[1],
        );
      }

      if (
        values.criteriaTypeFilters?.some(
          (filter) => 'requiredRank' in filter && filter.requiredRank && filter.requiredRank.length > 0,
        )
      ) {
        result = (result || achievements).filter((achievement) =>
          values.criteriaTypeFilters?.some((filter) => {
            return (
              'requiredRank' in filter &&
              isObjectCriteria(achievement.criteria) &&
              typeof achievement.criteria?.requiredRank === 'string' &&
              filter.requiredRank?.includes(achievement.criteria?.requiredRank)
            );
          }),
        );
      }
    }

    if (values.criteriaType?.includes('SUBSCRIPTION')) {
      if (
        values.criteriaTypeFilters?.some(
          (filter) => 'duration' in filter && filter.duration && filter.duration.length > 0,
        )
      ) {
        result = (result || achievements).filter((achievement) =>
          values.criteriaTypeFilters?.some((filter) => {
            return (
              'duration' in filter &&
              isObjectCriteria(achievement.criteria) &&
              typeof achievement.criteria?.duration === 'string' &&
              filter.duration?.includes(achievement.criteria?.duration)
            );
          }),
        );
      }

      if (values.criteriaTypeFilters?.some((filter) => 'firstTimeOnly' in filter && filter.firstTimeOnly)) {
        result = (result || achievements).filter((achievement) =>
          values.criteriaTypeFilters?.some((filter) => {
            return (
              'firstTimeOnly' in filter &&
              isObjectCriteria(achievement.criteria) &&
              typeof achievement.criteria?.firstTimeOnly === 'boolean' &&
              filter.firstTimeOnly === achievement.criteria?.firstTimeOnly
            );
          }),
        );
      }
    }

    if (result) {
      setFilteredAchievements(result);
      setFilterAchievements(result);
    }
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
                                  if (checked) {
                                    // Добавляем тип в criteriaType и создаем новый фильтр
                                    addTypeFilter(type.id);
                                    field.onChange([...values, type.id]);
                                  } else {
                                    // Удаляем тип из criteriaType и соответствующий фильтр
                                    const filterIndex = criteriaTypeFiltersFields.findIndex(
                                      (filter) => filter.type === type.id,
                                    );
                                    if (filterIndex !== -1) {
                                      removeCriteriaTypeFilter(filterIndex);
                                    }
                                    field.onChange(values.filter((value) => value !== type.id));
                                  }
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
        {criteriaTypeFiltersFields.map((field, index) => (
          <div key={field.id}>
            {(field.type === 'COURSE_REGISTRATION' || field.type === 'COURSE_COMPLETION') && (
              <CourseCompletionFilters
                form={form}
                prefix={`criteriaTypeFilters.${index}`}
                courseNames={courseNames}
                prices={prices}
                setPrices={setPrices}
              />
            )}
            {field.type === 'EXERCISE_COMPLETION' && (
              <ExerciseCompletionFilters
                form={form}
                prefix={`criteriaTypeFilters.${index}`}
                amount={amount}
                setAmount={setAmount}
                pointsToComplete={pointsToComplete}
                setPointsToComplete={setPointsToComplete}
              />
            )}

            {field.type === 'SUBSCRIPTION' && (
              <SubscriptionFilters
                form={form}
                prefix={`criteriaTypeFilters.${index}`}
                monthes={monthes}
                setMonthes={setMonthes}
              />
            )}
          </div>
        ))}

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
        <Button variant="custom" type="submit" className="mr-5">
          Применить
        </Button>
        {achievements !== filteredAchievements && (
          <Button
            type="button"
            className="mr-auto my-4"
            variant="custom"
            onClick={() => {
              setFilterAchievements(achievements);
              setFilteredAchievements(achievements);
              form.reset();
            }}
          >
            Сбросить фильтр
          </Button>
        )}
      </form>
    </Form>
  );
};

export default memo(AchievementsFilters);
