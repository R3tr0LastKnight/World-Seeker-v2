import HomeClient from "@/components/HomeClient";
import { Listing } from "@/types/listing";

async function getListings(): Promise<Listing[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const listings = await getListings();
  return <HomeClient listings={listings} />;
}
