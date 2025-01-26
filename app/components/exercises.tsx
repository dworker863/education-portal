import { FC } from 'react';
import { cn } from '../libs/cn';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { useForm } from 'react-hook-form';
import { Select, SelectItem, SelectTrigger, SelectValue } from './select';
import { SelectContent } from '@radix-ui/react-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from './checkbox';

type TExercisesProps = {
  showExercises: boolean;
};

const SelectSchema = z.object({
  language: z.string(),
  rank: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Укажите ранг',
  }),
});

const Exercises: FC<TExercisesProps> = ({ showExercises }) => {
  const form = useForm<z.infer<typeof SelectSchema>>({
    resolver: zodResolver(SelectSchema),
    defaultValues: {
      language: '',
      rank: ['d-'],
    },
  });

  const ranks = [
    {
      id: 'd-',
      label: 'D-',
    },
    {
      id: 'd',
      label: 'D',
    },
    {
      id: 'd+',
      label: 'D+',
    },
    {
      id: 'c-',
      label: 'C-',
    },
    {
      id: 'c',
      label: 'C',
    },
    {
      id: 'c+',
      label: 'C+',
    },
  ] as const;

  const onSubmit = (values: z.infer<typeof SelectSchema>) => {
    console.log(values);
  };

  return (
    <div
      className={cn(
        'absolute top-0 right-[-400px] -z-10 flex flex-col w-[400px] h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-[400px]': showExercises },
      )}
    >
      <h2>Exercises</h2>
      <Form {...form}>
        <form
          className="w-2/3 space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Язык программирования</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите язык программирования" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="test">JavaScript</SelectItem>
                    <SelectItem value="test">Python</SelectItem>
                    <SelectItem value="test">Go</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rank"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Ранг</FormLabel>
                </div>
                {ranks.map((rank) => (
                  <FormField
                    key={rank.id}
                    control={form.control}
                    name="rank"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={rank.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              className="w-5 h-5 bg-orange-700 data-[state=checked]:bg-orange-700"
                              checked={field.value?.includes(rank.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, rank.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== rank.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal leading-[18px]">
                            {rank.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default Exercises;
