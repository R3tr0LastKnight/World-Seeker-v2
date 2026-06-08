import LocaTile from "@/components/LocaTile";
import { Listing } from "@/types/listing";

async function getListings(): Promise<Listing[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings`, {
    cache: "no-store", // always fresh
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const listings = await getListings();

  return (
    <div className="flex flex-col flex-1 items-center p-4 px-8 bg-zinc-50 font-sans dark:bg-black">
      {listings.length === 0 ? (
        <p className="text-gray-400 mt-16 text-lg">
          No listings yet. Create one!
        </p>
      ) : (
        <div className="grid lg:grid-cols-3 w-full items-center justify-center">
          {listings.map((listing) => (
            <LocaTile key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
