"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "./ui/calendar";
import { Listing } from "@/types/listing";
import { DateRange } from "react-day-picker";
import { DrawerTrigger } from "./ui/drawer";
import { useMongoUser } from "@/hooks/useMongoUser";
import { toast } from "sonner";

type Props = {
  listing: Listing;
};

const BookingWidget = ({ listing }: Props) => {
  const { mongoUser } = useMongoUser();

  const [range, setRange] = useState<DateRange>();
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});
  const [booking, setBooking] = useState(false);

  const closeTriggerRef = useRef<HTMLButtonElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    fetch(`/api/bookings?listingId=${listing.id}`)
      .then((r) => r.json())
      .then(setHeatmap)
      .catch(console.error);
  }, [listing.id]);

  async function handleBooking() {
    try {
      if (!mongoUser) {
        alert("Please login first");
        return;
      }

      if (!range?.from || !range?.to) {
        alert("Please select a date range");
        return;
      }

      setBooking(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: mongoUser.id,
          listingId: listing.id,
          startDate: range.from,
          endDate: range.to,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Booking failed");
        return;
      }

      toast.success("Booking was successful", {
        description: "we hope you enjoy your stay.",
      });

      // refresh heatmap
      const heatmapRes = await fetch(`/api/bookings?listingId=${listing.id}`);

      const heatmapData = await heatmapRes.json();
      setHeatmap(heatmapData);

      // close drawer
      closeTriggerRef.current?.click();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="border rounded p-4 h-fit shadow-sm">
      <div className="text-2xl font-bold mb-1">
        ₹ {listing.price}
        <span className="text-base font-normal text-gray-500"> / night</span>
      </div>

      <div className="flex mt-4">
        <div>
          {" "}
          <p className="mb-3">
            Pick the date range in which you would like to stay
          </p>
          <p className="mb-3">
            These are the booking trends for this listing based on current live
            data:
          </p>
          <div className="flex flex-col gap-4 text-xs mb-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-100 text-green-950 dark:bg-green-900 dark:text-green-100 rounded" />
              Peaceful Stays
            </div>

            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-200 text-yellow-950 dark:bg-yellow-800 dark:text-yellow-100 rounded" />
              Average Bookings
            </div>

            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-300 text-red-950 dark:bg-red-900 dark:text-red-100 rounded" />
              Booming Tourism
            </div>
          </div>
        </div>

        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          captionLayout="dropdown"
          className="rounded-lg border"
          disabled={{ before: today }}
          startMonth={today}
          endMonth={new Date(today.getFullYear() + 5, 11)}
          modifiers={{
            low: (date) => {
              const key = date.toISOString().split("T")[0];
              const count = heatmap[key] || 0;

              return count > 0 && count < 3;
            },

            medium: (date) => {
              const key = date.toISOString().split("T")[0];
              const count = heatmap[key] || 0;

              return count >= 3 && count < 5;
            },

            high: (date) => {
              const key = date.toISOString().split("T")[0];
              const count = heatmap[key] || 0;

              return count >= 5;
            },
          }}
          modifiersClassNames={{
            low: "bg-green-100 text-green-950 dark:bg-green-900 dark:text-green-100",
            medium:
              "bg-yellow-200 text-yellow-950 dark:bg-yellow-800 dark:text-yellow-100",
            high: "bg-red-300 text-red-950 dark:bg-red-900 dark:text-red-100",
          }}
        />
      </div>

      <button
        onClick={handleBooking}
        disabled={booking}
        className="w-full mt-4 cursor-pointer hover:bg-gray-800 bg-black text-white border py-2 rounded transition-all disabled:opacity-50"
      >
        {booking ? "Booking..." : "Book Now"}
      </button>

      {/* hidden drawer close trigger */}
      <DrawerTrigger asChild>
        <button ref={closeTriggerRef} className="hidden">
          Close
        </button>
      </DrawerTrigger>
    </div>
  );
};

export default BookingWidget;
