export type Listing = {
  id: string;
  title: string;
  address: string;
  description: string | null;
  price: number;
  perks: string[];
  photos: string[];
  ownerId: string;
  createdAt: string;
  location?: [number, number];
  size?: number;
  idx: string;
  label?: string;
};
