import Image from "next/image";
import React from "react";
import { Listing } from "@prisma/client";

type Props = {
  listing: Listing;
};

const LocaRect = ({ listing }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] rounded border p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow">
      {listing.photos[0] ? (
        <Image
          src={listing.photos[0]}
          width={300}
          height={200}
          alt={listing.title}
          className="rounded object-cover w-full lg:w-[20%] h-36"
        />
      ) : (
        <div className="rounded bg-gray-100 dark:bg-gray-800 w-full lg:w-[20%] h-36 flex items-center justify-center text-gray-400 text-sm">
          No photo
        </div>
      )}
      <div className="flex flex-col items-start justify-center gap-1">
        <h2 className="font-bold text-lg leading-tight">{listing.title}</h2>
        <h3 className="text-sm text-gray-500">{listing.address}</h3>
        <div className="mt-1">
          <span className="font-bold">₹ {listing.price}</span>
          <span className="text-sm text-gray-500"> per Night</span>
        </div>
        {listing.description && (
          <p className="line-clamp-2 text-xs text-gray-500 mt-1">
            {listing.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default LocaRect;
