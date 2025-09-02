export const calculatePrizeWithDiscount = (prize: number, discountPercent: number | null) => {
  if (discountPercent && discountPercent > 0) {
    const discountAmount = (prize * discountPercent) / 100;
    return Math.max(prize - discountAmount, 0);
  }
  return prize;
};
