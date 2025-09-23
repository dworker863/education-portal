'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import { Button } from './button';
import SuccessMessage from './success-message';

type TSubscribeOfferProps = {
  label: string;
  amount: number;
  price: number;
  subscribeHandler: () => void;
  setChosenOffer: Dispatch<SetStateAction<{ label: string; amount: number; price: number } | null>>;
};

const SubscribeOfferCard: FC<TSubscribeOfferProps> = ({ label, amount, price, subscribeHandler, setChosenOffer }) => {
  return (
    <div className="flex flex-col w-full mb-5 p-5 space-y-4 rounded-lg bg-customBlock cursor-pointer">
      <h2 className="text-center text-lg text-customAccent font-semibold">{label}</h2>
      <p>Цена: ${price.toFixed(2)}</p>
      <p className="text-sm">9.99$ в месяц</p>
      <SuccessMessage message="Экономия 0%" />
      <Button
        className="mt-4"
        variant="custom"
        onClick={() => {
          setChosenOffer({ label, amount, price });
          subscribeHandler();
        }}
      >
        Оформить подписку
      </Button>
    </div>
  );
};

export default SubscribeOfferCard;
