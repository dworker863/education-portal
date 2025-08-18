'use client';

import React, { FC, memo } from 'react';
import { IPrizeTicket } from '../libs/interfaces/interfaces';

type TPrizeTicketCardProps = {
  prizeTicket: IPrizeTicket;
};

const PrizeTicketCard: FC<TPrizeTicketCardProps> = ({ prizeTicket }) => {
  return (
    <div className="flex flex-col w-full mb-5 p-5 rounded-lg bg-primary">
      <h2 className="mb-5 text-center text-xl uppercase">{prizeTicket.type}</h2>
    </div>
  );
};

export default memo(PrizeTicketCard);
