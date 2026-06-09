"use client";

import Image from "next/image";
import React from "react";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import LocationDrawer from "./LocationDrawer";
import { Listing } from "@/types/listing";

type Props = {
  listing: Listing;
};

const LocaTile = ({ listing }: Props) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="justify-center my-2 cursor-pointer">
          <div className="rounded flex justify-center md:justify-start mb-2 h-[70%]">
            {listing.photos[0] ? (
              <div className="relative w-[95%] aspect-video ml-2">
                <Image
                  src={listing.photos[0]}
                  alt={listing.title}
                  fill
                  className="rounded object-cover"
                />
              </div>
            ) : (
              // <Image
              //   src={listing.photos[0]}
              //   width={1000}
              //   height={600}
              //   alt={listing.title}
              //   className="rounded-2xl object-cover md:w-[90%]"
              // />
              <div className="rounded md:w-[90%] h-60 bg-gray-200 flex items-center justify-center text-gray-400">
                No photo
              </div>
            )}
          </div>
          <div className="pl-2 md:pl-1 flex flex-col items-start">
            <h2 className="font-bold leading-4 ml-2">{listing.title}</h2>
            <h3 className="text-sm ml-2">{listing.address}</h3>
            <div className="mt-1 ml-2">
              <span className="font-bold">₹ {listing.price}</span> per Night
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <LocationDrawer listing={listing} />
    </Drawer>
  );
};

export default LocaTile;
