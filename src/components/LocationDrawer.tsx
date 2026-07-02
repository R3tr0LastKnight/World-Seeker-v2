"use client";

import React, { useState } from "react";
import { DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import Image from "next/image";
import { Listing } from "@/types/listing";
import { PERKS } from "./Perks"; // make sure PERKS is exported
import BookingWidget from "./BookingWidget";

type Props = {
  listing: Listing;
};

const LocationDrawer = ({ listing }: Props) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const activePerks = PERKS.filter((p) => listing.perks.includes(p.name));

  if (showAllPhotos) {
    return (
      <DrawerContent>
        <div className="my-6 overflow-y-scroll mx-4 lg:mx-16 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All Photos — {listing.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="border px-4 py-2 rounded hover:bg-black hover:text-white transition-all cursor-pointer "
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {listing.photos.map((photo, i) => (
              <div key={photo} className="relative h-56">
                <Image
                  src={photo}
                  alt={`photo ${i + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    );
  }

  return (
    <DrawerContent>
      <div className="my-6 overflow-y-scroll mx-4 lg:mx-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <DrawerTitle>
          <h1 className="text-4xl">{listing.title}</h1>
        </DrawerTitle>

        <a
          target="_blank"
          href={`https://maps.google.com/?q=${encodeURIComponent(listing.address)}`}
          className="font-semibold underline mt-2 mb-4 flex items-center gap-1"
          rel="noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          {listing.address}
        </a>

        {/* Photo grid */}
        <div className="relative">
          <div className="grid gap-2 lg:grid-cols-[2fr_1fr] my-2 rounded overflow-hidden">
            {/* Main photo */}
            <div className="relative h-72 lg:h-96">
              {listing.photos[0] && (
                <Image
                  src={listing.photos[0]}
                  alt="main photo"
                  fill
                  className="object-cover rounded cursor-pointer"
                  onClick={() => setShowAllPhotos(true)}
                />
              )}
            </div>
            {/* Side photos */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {[listing.photos[1], listing.photos[2]].map((photo, i) =>
                photo ? (
                  <div key={i} className="relative h-36 lg:h-full">
                    <Image
                      src={photo}
                      alt={`photo ${i + 2}`}
                      fill
                      className="object-cover rounded cursor-pointer"
                      onClick={() => setShowAllPhotos(true)}
                    />
                  </div>
                ) : null,
              )}
            </div>
          </div>
          {listing.photos.length > 0 && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="flex gap-1 items-center absolute bottom-2 right-2 hover:bg-black hover:text-white bg-white text-black transition-all cursor-pointer border py-2 px-4 rounded shadow-md text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              Show all {listing.photos.length} photos
            </button>
          )}
        </div>

        {/* Description + Perks + Price */}
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] mt-4 gap-8">
          <div>
            {listing.description && (
              <div className="my-4">
                <h2 className="font-bold text-2xl mb-1">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {listing.description}
                </p>
              </div>
            )}

            {activePerks.length > 0 && (
              <div className="my-4">
                <h2 className="font-bold text-2xl mb-2">Perks</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {activePerks.map(({ name, icon, label }) => (
                    <div
                      key={name}
                      className="border rounded p-3 flex items-center gap-2 text-sm"
                    >
                      {icon}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking widget placeholder */}
          <BookingWidget listing={listing} />
        </div>
      </div>
    </DrawerContent>
  );
};

export default LocationDrawer;
