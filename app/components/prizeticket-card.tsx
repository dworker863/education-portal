'use client';

import React, { FC, memo } from 'react';
import { IPrizeTicket } from '../libs/interfaces/interfaces';

type TPrizeTicketCardProps = {
  prizeTicket: IPrizeTicket;
};

const PrizeTicketCard: FC<TPrizeTicketCardProps> = ({ prizeTicket }) => {
  return (
    <div className="flex flex-col w-full mb-5 p-5 rounded-lg bg-customBlock">
      <h2 className="mb-5 text-center text-xl uppercase">{prizeTicket.name}</h2>
      <p className="text-right text-sm">{prizeTicket.code}</p>
      <div className="flex justify-between items-center mt-5">
        <p>{prizeTicket.type}</p>
        {prizeTicket.type === 'DISCOUNT' ? (
          <p className="text-customSecondary">{prizeTicket.percent}%</p>
        ) : (
          <p>{prizeTicket.months} months</p>
        )}
      </div>
    </div>
  );
};

export default memo(PrizeTicketCard);
