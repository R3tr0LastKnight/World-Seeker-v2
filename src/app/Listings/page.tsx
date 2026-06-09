"use client";

import ListingDrawer from "@/components/ListingDrawer";
import LocaRect from "@/components/LocaRect";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { useAuth } from "@/hooks/useAuth";
import { Listing } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const Page = () => {
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | undefined>(
    undefined,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchListings = () => {
    if (!user) return;
    fetch(`/api/listings?uid=${user.uid}`)
      .then((r) => r.json())
      .then(setListings)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading || !user) return;
    fetchListings();
  }, [user, authLoading]);

  const openCreate = () => {
    setSelectedListing(undefined); // clear selection → create mode
    setDrawerOpen(true);
  };

  const openEdit = (listing: Listing) => {
    setSelectedListing(listing); // set listing → edit mode
    setDrawerOpen(true);
  };

  const handleSaved = () => {
    fetchListings(); // refresh list
    setDrawerOpen(false);
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div className="flex flex-col lg:flex-row my-4 mx-4 gap-4">
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)] rounded min-h-50 w-full">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 p-6">
            <h1 className="text-2xl font-bold">Listings</h1>
            <button
              onClick={openCreate}
              className="px-4 py-2 border rounded cursor-pointer flex items-center gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.03)]"
            >
              <FaPlus /> Create a listing
            </button>
          </div>

          <div className="p-6 h-[70vh] max-h-[70vh] overflow-y-scroll scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : listings.length === 0 ? (
              <p className="text-gray-400">No listings yet. Create one!</p>
            ) : (
              listings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => openEdit(listing)}
                  className="cursor-pointer"
                >
                  <LocaRect listing={listing} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* single drawer — switches between create/edit based on selectedListing */}
      <ListingDrawer listing={selectedListing} onSaved={handleSaved} />
    </Drawer>
  );
};

export default Page;
