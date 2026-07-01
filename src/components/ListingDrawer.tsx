"use client";

import React, { useEffect, useState } from "react";
import { DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { SubmitHandler, useForm } from "react-hook-form";
import Perks from "./Perks";
import PhotoSelector from "./PhotoSelector";
import { useMongoUser } from "@/hooks/useMongoUser";
import { Listing } from "@prisma/client";

type Inputs = {
  title: string;
  address: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
};

type Props = {
  listing?: Listing; // if passed → edit mode
  onSaved?: () => void; // callback to refresh list after save
};

const ListingDrawer = ({ listing, onSaved }: Props) => {
  const [photos, setPhotos] = useState<string[]>(listing?.photos ?? []);
  const [perks, setPerks] = useState<string[]>(listing?.perks ?? []);
  const [submitting, setSubmitting] = useState(false);
  const { mongoUser } = useMongoUser();
  const isEdit = !!listing;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: listing?.title ?? "",
      address: listing?.address ?? "",
      description: listing?.description ?? "",
      price: listing?.price ?? 0,
      // location is stored as [lat, lng] (cobe marker format)
      latitude: listing?.location?.[0] ?? 0,
      longitude: listing?.location?.[1] ?? 0,
    },
  });

  // if listing prop changes (different tile clicked), reset form
  useEffect(() => {
    reset({
      title: listing?.title ?? "",
      address: listing?.address ?? "",
      description: listing?.description ?? "",
      price: listing?.price ?? 0,
      latitude: listing?.location?.[0] ?? 0,
      longitude: listing?.location?.[1] ?? 0,
    });
    setPhotos(listing?.photos ?? []);
    setPerks(listing?.perks ?? []);
  }, [listing?.id]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!isEdit && !mongoUser?.id) {
      alert("You must be logged in to create a listing.");
      return;
    }

    setSubmitting(true);
    try {
      const { latitude, longitude, ...rest } = data;

      // location expected by the globe as [lat, lng]
      const location = [Number(latitude), Number(longitude)];
      const size = 0.001;
      const idx = data.title.trim().replace(/\s+/g, "-");
      const label = data.title.trim();

      const res = await fetch("/api/listings", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit
            ? {
                id: listing.id,
                ...rest,
                perks,
                photos,
                location,
                size,
                idx,
                label,
              }
            : {
                ...rest,
                perks,
                photos,
                location,
                size,
                idx,
                label,
                ownerId: mongoUser!.id,
              },
        ),
      });

      if (!res.ok) throw new Error("Failed to save listing");

      if (!isEdit) {
        reset();
        setPhotos([]);
        setPerks([]);
      }

      onSaved?.(); // refresh parent list
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DrawerContent>
      <div className="my-6 overflow-y-scroll mx-4 lg:mx-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <DrawerTitle>
          <h1 className="text-4xl my-4">
            {isEdit ? "Edit Listing" : "Create a Listing"}
          </h1>
        </DrawerTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 justify-center w-full"
        >
          {/* Title */}
          <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-2 relative items-start">
              <label className="lg:w-1/3 flex gap-2 items-end">
                <p className="font-bold text-xl">Title</p>
                <p className="font-extralight text-sm">Name of your location</p>
              </label>
              <input
                className="w-full lg:w-2/3 border rounded px-2 py-1"
                placeholder="Impel down"
                {...register("title", { required: true })}
              />
            </div>
            {errors.title && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          {/* Address */}
          <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-2 relative items-start">
              <label className="lg:w-1/3 flex gap-2 items-end">
                <p className="font-bold text-xl">Address</p>
                <p className="font-extralight text-sm">
                  Where is your location?
                </p>
              </label>
              <input
                className="w-full lg:w-2/3 border rounded px-2 py-1"
                placeholder="Calm Belt"
                {...register("address", { required: true })}
              />
            </div>
            {errors.address && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          {/* Description */}
          <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-2 relative items-start">
              <label className="lg:w-1/3 flex gap-2 items-end">
                <p className="font-bold text-xl">Description</p>
                <p className="font-extralight text-sm">
                  Describe your location
                </p>
              </label>
              <textarea
                className="w-full lg:w-2/3 border rounded px-2 h-24"
                placeholder="Impel Down, also known as the Underwater Prison (海底監獄, Kaitei Kangoku?) and the Great Prison (大監獄, Dai Kangoku?), is a government-controlled stronghold in Paradise together with Marineford and Enies Lobby. It is the World Government's maximum-security prison for the most dangerous criminals and pirates.[2] It is located underwater in the middle of the Calm Belt and part of the Tarai Current.[3]"
                {...register("description")}
              />
            </div>
          </div>

          {/* Location (lat/lng) */}
          <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-2 relative items-start">
              <label className="lg:w-1/3 flex gap-2 items-end">
                <p className="font-bold text-xl">Location</p>
                <p className="font-extralight text-sm">
                  Real-world coordinates on the globe
                </p>
              </label>
              <div className="w-full lg:w-2/3 flex gap-2">
                <input
                  className="w-1/2 border rounded px-2 py-1"
                  placeholder="Latitude"
                  type="number"
                  step="any"
                  {...register("latitude", {
                    required: true,
                    valueAsNumber: true,
                    min: -90,
                    max: 90,
                  })}
                />
                <input
                  className="w-1/2 border rounded px-2 py-1"
                  placeholder="Longitude"
                  type="number"
                  step="any"
                  {...register("longitude", {
                    required: true,
                    valueAsNumber: true,
                    min: -180,
                    max: 180,
                  })}
                />
              </div>
            </div>
            {(errors.latitude || errors.longitude) && (
              <span className="text-red-500 text-sm">
                Valid latitude (-90 to 90) and longitude (-180 to 180) are
                required
              </span>
            )}
          </div>

          {/* Perks */}
          <div className="w-full">
            <div className="flex flex-col gap-2 items-start">
              <label className="lg:w-1/3 flex flex-col lg:flex-row gap-2 lg:items-end">
                <p className="font-bold text-xl">Perks</p>
                <p className="font-extralight text-sm">Select those that fit</p>
              </label>
              <Perks selected={perks} onChange={setPerks} />
            </div>
          </div>

          {/* Photos */}
          <div className="w-full">
            <div className="flex flex-col gap-2 items-start">
              <label className="lg:w-1/3 flex flex-col lg:flex-row gap-2 lg:items-end">
                <p className="font-bold text-xl">Photos</p>
                <p className="font-extralight text-sm">Add photos</p>
              </label>
              <PhotoSelector photos={photos} onChange={setPhotos} />
            </div>
          </div>

          {/* Price */}
          <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-2 relative items-start">
              <label className="lg:w-1/3 flex gap-2 items-end">
                <p className="font-bold text-xl">Price</p>
                <p className="font-extralight text-sm">Price per night?</p>
              </label>
              <input
                className="w-full lg:w-2/3 border rounded px-2 py-1"
                placeholder="₹ xxx"
                type="number"
                {...register("price", { required: true, min: 0 })}
              />
            </div>
            {errors.price && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <input
            className="border px-4 py-2 rounded hover:bg-black hover:text-white transition-all disabled:opacity-50 cursor-pointer"
            type="submit"
            value={
              submitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Listing"
            }
            disabled={submitting}
          />
        </form>
      </div>
    </DrawerContent>
  );
};

export default ListingDrawer;
