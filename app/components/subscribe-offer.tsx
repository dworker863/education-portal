import { FC } from 'react';

type TSubscribeOfferProps = {
  name: string;
  label: string;
  price: number;
};

const SubscribeOffer: FC<TSubscribeOfferProps> = ({ name, label, price }) => {
  return (
    <div className="flex flex-col w-full mb-5 p-5 rounded-lg bg-primary cursor-pointer">
      <h2>{label}</h2>
      <p>Price: ${price.toFixed(2)}</p>
      <button>Subscribe</button>
    </div>
  );
};

export default SubscribeOffer;
