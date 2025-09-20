import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import SubscribeOffer from '../components/subscribe-offer';
import { subscribeOffers } from '../libs/utils/static-data';

export const revalidate = 86400;

export default async function SubscribePage() {
  return (
    <main>
      <h1 className="text-center text-lg mb-10 font-semibold">Subscribe Page</h1>
      <div className="flex flex-col gap-2">
        <p className="flex gap-4">
          <IoCheckmarkDoneSharp className="text-green-700 hover:scale-125" size={20} /> Неограниченный доступ ко всем
          курсам
        </p>
        <p className="flex gap-4">
          <IoCheckmarkDoneSharp className="text-green-700 hover:scale-125" size={20} /> Круглосуточная поддержка
        </p>
        <p className="flex gap-4">
          <IoCheckmarkDoneSharp className="text-green-700 hover:scale-125" size={20} /> Помощь в обучении
        </p>
      </div>
      <div className="flex justify-between gap-8 mt-8">
        {subscribeOffers.map((offer) => (
          <SubscribeOffer key={offer.name} name={offer.name} label={offer.label} price={offer.price} />
        ))}
      </div>
    </main>
  );
}
