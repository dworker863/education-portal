import { FC } from 'react';
import { cn } from '../libs/cn';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { useForm } from 'react-hook-form';
import { Select, SelectItem, SelectTrigger, SelectValue } from './select';
import { SelectContent } from '@radix-ui/react-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from './checkbox';
import { ColumnDef } from '@tanstack/react-table';
import ExercisesTable from './exercises-table';
import { Button } from './button';
import { ArrowUpDown } from 'lucide-react';

type TExercisesProps = {
  showExercises: boolean;
};

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const SelectSchema = z.object({
  language: z.string(),
  rank: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Укажите ранг',
  }),
});

const payments: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  // ...
];

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
];

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

const Exercises: FC<TExercisesProps> = ({ showExercises }) => {
  const form = useForm<z.infer<typeof SelectSchema>>({
    resolver: zodResolver(SelectSchema),
    defaultValues: {
      language: '',
      rank: ['d-'],
    },
  });

  const onSubmit = (values: z.infer<typeof SelectSchema>) => {
    console.log(values);
  };

  return (
    <div
      className={cn(
        'absolute top-0 left-full -z-10 flex flex-col w-svw h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-full': showExercises },
      )}
    >
      <h2>Exercises</h2>
      <Form {...form}>
        <form
          className="mb-5 w-2/3 space-y-6"
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
                  <FormControl className="w-[300px]">
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
      <ExercisesTable columns={columns} data={payments} />
    </div>
  );
};

export default Exercises;
