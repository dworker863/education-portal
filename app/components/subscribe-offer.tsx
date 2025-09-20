'use client';

import { FC } from 'react';
import { Button } from './button';
import SuccessMessage from './success-message';

type TSubscribeOfferProps = {
  name: string;
  label: string;
  price: number;
};

const SubscribeOffer: FC<TSubscribeOfferProps> = ({ name, label, price }) => {
  return (
    <div className="flex flex-col w-full mb-5 p-5 space-y-4 rounded-lg bg-primary cursor-pointer">
      <h2 className="text-center text-lg text-customSecondary font-semibold">{label}</h2>
      <p>Цена: ${price.toFixed(2)}</p>
      <p className="text-sm">9.99$ в месяц</p>
      <SuccessMessage message="Экономия 0%" />
      <Button
        className="mt-4"
        variant="custom"
        onClick={() => {
          console.log(`Subscribed to ${name}`);
        }}
      >
        Оформить подписку
      </Button>
    </div>
  );
};

export default SubscribeOffer;
