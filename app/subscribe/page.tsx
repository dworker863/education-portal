import SubscribeOffer from '../components/subscribe-offer';
import { subscribeOffers } from '../libs/utils/static-data';

export const revalidate = 86400;

export default async function SubscribePage() {
  return (
    <main>
      <h1>Subscribe Page</h1>
      <div className="flex justify-between gap-8 mt-8">
        {subscribeOffers.map((offer) => (
          <SubscribeOffer key={offer.name} name={offer.name} label={offer.label} price={offer.price} />
        ))}
      </div>
    </main>
  );
}
