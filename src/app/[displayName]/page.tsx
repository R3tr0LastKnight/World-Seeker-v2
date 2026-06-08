"use client";

import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import LocaRect from "@/components/LocaRect";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function UserPage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col lg:flex-row my-4 mx-4 gap-4">
      <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] rounded-lg  min-h-50 lg:w-1/3">
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
            <h1>Trips</h1>
            <div>8</div>
          </div>
          <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] text-center p-2 rounded w-1/3">
            <h1>Bookings</h1>
            <div>5</div>
          </div>
          <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] text-center p-2 rounded w-1/3">
            <h1>Locations</h1>
            <div>12</div>
          </div>
        </div>
      </div>

      <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] rounded-lg min-h-50 lg:w-[63%]">
        <div>
          <h1 className="text-2xl font-bold p-6">Bookings</h1>
        </div>
        <div className="p-6 h-[70vh] max-h-[70vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* <LocaRect />
          <LocaRect />
          <LocaRect /> */}
          <p>No bookings found.</p>
        </div>
      </div>
    </div>
  );
}
