"use client";

import { useState } from "react";
import Globe from "@/components/Globe";
import LocaTile from "@/components/LocaTile";
import LocationDrawer from "@/components/LocationDrawer";
import { Drawer } from "@/components/ui/drawer";
import { Listing } from "@/types/listing";

type Props = { listings: Listing[] };

export default function HomeClient({ listings }: Props) {
  const [selected, setSelected] = useState<Listing | null>(null);

  return (
    <Drawer
      open={selected !== null}
      onOpenChange={(open) => {
        if (!open) setSelected(null);
      }}
    >
      <div className="flex flex-col flex-1 items-center p-4 px-8 bg-zinc-50 font-sans dark:bg-black">
        <div>
          <Globe
            listings={listings}
            onMarkerClick={(idx) => {
              const found = listings.find((l) => l.idx === idx);
              if (found) setSelected(found);
            }}
          />
        </div>

        {listings.length === 0 ? (
          <p className="text-gray-400 mt-16 text-lg">
            No listings yet. Create one!
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 w-full items-center justify-center">
            {listings.map((listing) => (
              <LocaTile
                key={listing.id}
                listing={listing}
                onOpen={() => setSelected(listing)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && <LocationDrawer listing={selected} />}
    </Drawer>
  );
}
