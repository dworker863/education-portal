import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState, useTransition } from 'react';
import { createPrizeTicketSchema, editPrizeTicketSchema } from '../libs/validation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPrizeTicket, editPrizeTicket } from '../libs/server-actions/prizeticket-actions';
import { Button } from './button';
import { FaPlus } from 'react-icons/fa';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import RequiredSign from './required-sign';
import { Input } from './input';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { cn } from '../libs/cn';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { ru } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

type TPrizeTicketFormProps = {
  prizeTicketId?: string;
  mode: 'create' | 'edit';
};

const PrizeTicketForm: FC<TPrizeTicketFormProps> = ({ prizeTicketId, mode }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(mode === 'create' ? false : true);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const years = useMemo(() => Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i), []);

  const schema = mode === 'create' ? createPrizeTicketSchema : editPrizeTicketSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: mode === 'create' ? uuidv4() : undefined,
      name: mode === 'create' ? '' : undefined,
      type: mode === 'create' ? 'DISCOUNT' : undefined,
      percent: mode === 'create' ? 0 : undefined,
      months: mode === 'create' ? 1 : undefined,
      minAmountToActivate: 0,
      maxAmountToActivate: 0,
      validFrom: undefined,
      validUntil: undefined,
    },
  });

  const type = form.watch('type');

  useEffect(() => {
    if (mode === 'create') {
      if (type === 'DISCOUNT') {
        form.setValue('percent', 0);
        form.setValue('months', undefined);
      }
      if (type === 'SUBSCRIPTION') {
        form.setValue('percent', undefined);
        form.setValue('months', 1);
      }
    }
  }, [type, mode, form]);

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (mode === 'create') {
      startTransition(async () => {
        try {
          const response = await addPrizeTicket(values as z.infer<typeof createPrizeTicketSchema>);
          setError(null);
          setSuccess(response.success);
        } catch (err) {
          console.error(err);
          setSuccess(null);
          setError(err instanceof Error ? err.message : 'Ошибка создания');
        }
      });
    }

    if (mode === 'edit' && prizeTicketId) {
      startTransition(async () => {
        try {
          const response = await editPrizeTicket(prizeTicketId, values as z.infer<typeof editPrizeTicketSchema>);
          setError(null);
          setSuccess(response.success);

          setTimeout(() => {
            router.refresh();
          }, 1500);
        } catch (err) {
          console.error(err);
          setSuccess(null);
          setError(err instanceof Error ? err.message : 'Ошибка редактирования');
        }
      });
    }
  };

  return (
    <>
      {mode === 'create' && (
        <Button variant="custom" className="mb-5" onClick={() => setShowForm(!showForm)}>
          <FaPlus size={20} />
          <span className="ml-2">{!showForm ? 'Добавить Купон' : 'Скрыть'}</span>
        </Button>
      )}

      {showForm && (
        <Form {...form}>
          <form
            className="space-y-8 mb-5 px-5 py-10 w-[400px] rounded-md bg-primary"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип</FormLabel>
                  {mode === 'create' && <RequiredSign />}
                  <FormControl className="w-[300px]">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-[300px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип достижения" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DISCOUNT">Скидка</SelectItem>
                        <SelectItem value="SUBSCRIPTION">Подписка</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название купона" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'DISCOUNT' && (
              <FormField
                control={form.control}
                name="percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>% скидки (для DISCOUNT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Например, 20"
                        {...form.register('percent', { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === 'SUBSCRIPTION' && (
              <FormField
                control={form.control}
                name="months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Месяцы (для SUBSCRIPTION)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Например, 6"
                        {...form.register('months', { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === 'DISCOUNT' && (
              <FormField
                control={form.control}
                name="minAmountToActivate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мин. сумма для активации</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...form.register('minAmountToActivate', { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === 'DISCOUNT' && (
              <FormField
                control={form.control}
                name="maxAmountToActivate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Макс. сумма для активации</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...form.register('maxAmountToActivate', { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex w-full gap-5">
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-grow gap-1">
                    <FormLabel>Действует с</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              ' pl-3 text-left text-primary font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'd MMMM yyyy', { locale: ru })
                            ) : (
                              <span>Укажите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-primary" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          month={field.value}
                          onSelect={field.onChange}
                          onMonthChange={field.onChange}
                          locale={ru}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="flex flex-col flex-grow gap-1">
                <FormLabel>Укажите год</FormLabel>
                <Select
                  onValueChange={(year) => form.setValue('validFrom', new Date(new Date().setFullYear(Number(year))))}
                  defaultValue={String(year)}
                >
                  <FormControl className="w-[85px] text-primary bg-primary-foreground">
                    <SelectTrigger>
                      <SelectValue placeholder="Год" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <div className="flex w-full gap-5">
              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-grow gap-1">
                    <FormLabel>Действует до</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              ' pl-3 text-left text-primary font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'd MMMM yyyy', { locale: ru })
                            ) : (
                              <span>Укажите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-primary" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          month={field.value}
                          onSelect={field.onChange}
                          onMonthChange={field.onChange}
                          locale={ru}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="flex flex-col flex-grow gap-1">
                <FormLabel>Укажите год</FormLabel>
                <Select
                  onValueChange={(year) => form.setValue('validUntil', new Date(new Date().setFullYear(Number(year))))}
                  defaultValue={String(year)}
                >
                  <FormControl className="w-[85px] text-primary bg-primary-foreground">
                    <SelectTrigger>
                      <SelectValue placeholder="Год" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            <Button variant="custom" type="submit" disabled={isPending}>
              {mode === 'create' ? 'Добавить Купон' : 'Редактировать Купон'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default PrizeTicketForm;
