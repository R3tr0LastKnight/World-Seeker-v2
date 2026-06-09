import { Listing } from "@prisma/client";

export type BookingWithListing = {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  listing: Listing;
};
