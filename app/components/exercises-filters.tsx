import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Checkbox } from './checkbox';
import { ranks } from '../libs/utils/static-data';
import { SelectSchema } from '../libs/validation';

const ExercisesFilters = () => {
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <div className="flex flex-wrap gap-x-5 gap-y-3 w-[200px]">
                {ranks.map((rank) => (
                  <FormField
                    key={rank.id}
                    control={form.control}
                    name="rank"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={rank.id}
                          className="flex flex-row items-start space-x-2 space-y-0"
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
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ExercisesFilters;
