import Prizetickets from '../components/prizetickets';
import { getAllPrizeTickets } from '../libs/server-actions/prizeticket-actions';

export const revalidate = 86400;

export default async function Home() {
  const prizeTickets = await getAllPrizeTickets();

  return (
    <main>
      <Prizetickets prizeTickets={prizeTickets} />
    </main>
  );
}
