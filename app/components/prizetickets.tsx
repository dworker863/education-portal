'use client';

import React, { FC, memo } from 'react';
import { IPrizeTicket } from '../libs/interfaces/interfaces';
import PrizeTicketCard from './prizeticket-card';
import PrizeTicketFormWrapper from './prizeticket-form-wrapper';
import PrizeTicketForm from './prizeticket-form';

type TPrizeTicketsProps = {
  prizeTickets: IPrizeTicket[];
};

const PrizeTickets: FC<TPrizeTicketsProps> = ({ prizeTickets }) => {
  return (
    <section className="py-5">
      <h1 className="text-center mb-10">Prize Tickets</h1>
      <PrizeTicketForm mode="create" />
      <section>
        {prizeTickets.length > 0 &&
          prizeTickets.map((prizeTicket) => (
            <div key={prizeTicket.id}>
              <PrizeTicketCard key={prizeTicket.id + prizeTicket.code} prizeTicket={prizeTicket} />
              <PrizeTicketFormWrapper prizeTicketId={prizeTicket.id} />
            </div>
          ))}
        <br />
      </section>
    </section>
  );
};

export default memo(PrizeTickets);
