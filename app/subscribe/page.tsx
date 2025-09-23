import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import SubscribeOffers from '../components/subscribe-offers';

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
      <SubscribeOffers />
    </main>
  );
}
