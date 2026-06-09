/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import LocaRect from "@/components/LocaRect";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useMongoUser } from "@/hooks/useMongoUser";
import { BookingWithListing } from "@/types/booking";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function UserPage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { mongoUser } = useMongoUser();

  const [bookings, setBookings] = useState<BookingWithListing[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [stats, setStats] = useState({
    trips: 0,
    bookings: 0,
    locations: 0,
  });

  useEffect(() => {
    if (!user) return;

    fetch("/api/me/stats", {
      headers: {
        "x-firebase-uid": user.uid,
      },
    })
      .then((r) => r.json())
      .then(setStats);
  }, [user]);

  const fetchBookings = () => {
    if (!mongoUser) return;

    setBookingsLoading(true);

    fetch(`/api/bookings?userId=${mongoUser.id}`)
      .then((r) => r.json())
      .then(setBookings)
      .finally(() => setBookingsLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [mongoUser]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  async function handleCancelBooking(bookingId: string) {
    const res = await fetch(`/api/bookings?bookingId=${bookingId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to cancel booking");
      return;
    }

    fetchBookings();
  }

  return (
    <div className="flex flex-col lg:flex-row my-4 mx-4 gap-4">
      <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] rounded  min-h-50 lg:w-1/3">
        <div className="p-6 flex flex-col justify-center items-center">
          <Image
            src={user?.photoURL || "/default-profile.png"}
            alt={user?.displayName || "User"}
            className="h-60 w-60 rounded-full mb-4"
            referrerPolicy="no-referrer"
            width={240}
            height={240}
          />
          <p className="text-3xl font-semibold">{user?.displayName}</p>
          <p>{user?.email}</p>

          <div
            onClick={() => {
              router.push(`/`);
              handleLogout();
            }}
            className="cursor-target border py-2 px-3 w-24 rounded  hover:text-white hover:bg-black text-center font-bold mt-3 cursor-pointer"
          >
            Log Out
          </div>
        </div>
        <div className="flex px-6 py-2 w-full justify-center gap-3">
          <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] text-center p-2 rounded w-1/3">
            <h1 className="font-bold">Trips</h1>
            <div>{stats.trips}</div>
          </div>
          <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] text-center p-2 rounded w-1/3">
            <h1 className="font-bold"> Bookings</h1>
            {stats.bookings}
          </div>
          <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] text-center p-2 rounded w-1/3">
            <h1 className="font-bold">Locations</h1>
            {stats.locations}
          </div>
        </div>
      </div>

      <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] rounded min-h-50 lg:w-[63%]">
        <div>
          <h1 className="text-2xl font-bold p-6">Bookings</h1>
        </div>
        <div className="p-6 h-[70vh] max-h-[70vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {bookingsLoading ? (
            <p>Loading...</p>
          ) : bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            bookings.map((booking) => {
              const today = new Date();

              const startDate = new Date(booking.startDate);
              const endDate = new Date(booking.endDate);

              const isCompleted = today > endDate;

              const isInProgress = today >= startDate && today <= endDate;

              const isUpcoming = today < startDate;

              return (
                <LocaRect key={booking.id} listing={booking.listing}>
                  <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
                    <div>
                      <p className="text-sm">
                        Check In: {startDate.toLocaleDateString()}
                      </p>

                      <p className="text-sm">
                        Check Out: {endDate.toLocaleDateString()}
                      </p>
                    </div>
                    {isUpcoming && (
                      <div className="flex gap-2">
                        {/* <button className="border px-3 py-1 rounded hover:bg-black hover:text-white transition-all">
                          Change Dates
                        </button> */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="border cursor-pointer px-3 py-1 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all">
                              Cancel Booking
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This Action will cancel your booking.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelBooking(booking.id)}
                                className="cursor-pointer border px-3 py-1 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {/* <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="border px-3 py-1 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          Cancel Booking
                        </button> */}
                      </div>
                    )}{" "}
                    <div className="mt-2">
                      {isUpcoming && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                          Upcoming
                        </span>
                      )}

                      {isInProgress && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          In Progress
                        </span>
                      )}

                      {isCompleted && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </LocaRect>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
