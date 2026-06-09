"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "./ui/calendar";

type Props = {
  bookingId: string;
  onSaved: () => void;
};

export default function BookingDateDrawer({ bookingId, onSaved }: Props) {
  const [range, setRange] = useState<DateRange>();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  async function handleSave() {
    if (!range?.from || !range?.to) return;

    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId,
        startDate: range.from,
        endDate: range.to,
      }),
    });

    if (!res.ok) {
      alert("Failed to update booking");
      return;
    }

    onSaved();
  }

  return (
    <div className="border rounded p-4">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        disabled={{
          before: today,
        }}
      />

      <button
        onClick={handleSave}
        className="mt-4 border px-4 py-2 rounded hover:bg-black hover:text-white"
      >
        Save Dates
      </button>
    </div>
  );
}
