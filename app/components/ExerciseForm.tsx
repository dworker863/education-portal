import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addExerciseSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';

const ExerciseForm = () => {
  const form = useForm<z.infer<typeof addExerciseSchema>>({
    resolver: zodResolver(addExerciseSchema),
    // defaultValues: {
    //   name: '',
    // },
  });
  return <Form></Form>;
};

export default ExerciseForm;
