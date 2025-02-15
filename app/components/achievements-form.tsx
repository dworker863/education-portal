import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { createAchievementSchema } from '../libs/validation';
import { z } from 'zod';
import { Form } from './form';

const AchievementsForm = () => {
  const form = useForm<z.infer<typeof createAchievementSchema>>({
    resolver: zodResolver(createAchievementSchema),
    defaultValues: {
      name: '',
      task: '',
      language: '',
      requiredRank: '',
      discount: 0,
      courseName: '',
    },
  });

  const onSubmit = (values: z.infer<typeof createAchievementSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}></form>
    </Form>
  );
};

export default AchievementsForm;
