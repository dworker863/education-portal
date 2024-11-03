export interface ICourse {
  id: string;
  name: string;
  icon: string | null;
  certificateId: string | null;
  category: string;
  priceUSD: number;
  completedUsersCount: number;
  usersIds: string[];
  meta: string[];
}
