import Prizetickets from '../components/prizetickets';
import { getAllPrizeTickets } from '../libs/server-actions/prizeticket-actions';

export default async function PrizeTicketsPage() {
  const prizeTickets = await getAllPrizeTickets();

  return (
    <main>
      <Prizetickets prizeTickets={prizeTickets} />
    </main>
  );
}
