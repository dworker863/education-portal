'use client';

import { subscribeOffers } from '../libs/utils/static-data';
import SubscribeOfferCard from '../components/subscribe-offer-card';
import { useSession } from 'next-auth/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ConfirmationContext } from './app-wrapper';
import Spinner from './spinner';
import { subscribeForOffer } from '../libs/server-actions/subscribe';

const SubscribeOffers = () => {
  const session = useSession();
  const user = session.data?.user;
  const confirmationContext = useContext(ConfirmationContext);
  const [isPending, setIsPending] = useState(false);
  const [chosenOffer, setChosenOffer] = useState<null | { label: string; amount: number; price: number }>(null);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        if (user) {
          if (confirmationContext?.modalType === 'confirmation' && confirmationContext.confirmation && chosenOffer) {
            if (user.moneyUSD < chosenOffer.price) {
              throw new Error('Недостаточно средств на балансе');
            }

            setIsPending(true);

            const { achievementProgress, updatedUser } = await subscribeForOffer(
              user.id,
              chosenOffer.amount,
              chosenOffer.price,
            );

            const achievementPrizeTickets = achievementProgress.filter((progress) => progress?.prizeTicket);

            await session.update({
              ...session.data?.user,
              moneyUSD: updatedUser.moneyUSD,
              subscription: updatedUser.subscription,
              prizeTickets: [...(user.prizeTickets ?? []), ...achievementPrizeTickets],
            });

            setIsPending(false);
            confirmationContext?.setModalType(null);
            confirmationContext?.setConfirmation(false);
            return;
          }

          if (confirmationContext?.modalType === 'usage' && confirmationContext?.confirmation) {
          }
        }
      } catch (error) {
        console.error('Error subscribing user:', error);
      }
    };

    loadSubscription();
  }, [user, confirmationContext]);

  const subscribeHandler = useCallback(async () => {
    // if (user && user?.coursesProgress?.some((progress) => progress.courseId === course.id)) {
    //   router.push(`/courses/${course.name}`);
    //   return;
    // }

    if (user?.prizeTickets && user?.prizeTickets.length > 0) {
      confirmationContext?.setModalType('usage');
      confirmationContext?.setUsageModalText(
        'Если вы хотите использовать призовой билет, выберите билет из списка и подтвердите действие.',
      );
      confirmationContext?.setIsModalOpen(true);
      return;
    }

    if (!confirmationContext?.confirmation) {
      confirmationContext?.setModalType('confirmation');
      confirmationContext?.setConfirmModalText(
        'Вы уверены, что хотите оформить подписку по этому тарифу? С вашего баланса будет списана соответствующая сумма.',
      );
      confirmationContext?.setIsModalOpen(true);
      return;
    }
  }, [confirmationContext, user]);

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : (
        <div className="flex justify-between gap-8 mt-8">
          {subscribeOffers.map((offer, index) => (
            <SubscribeOfferCard
              key={offer.name + index}
              label={offer.label}
              amount={offer.amount}
              price={offer.price}
              subscribeHandler={subscribeHandler}
              setChosenOffer={setChosenOffer}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SubscribeOffers;
