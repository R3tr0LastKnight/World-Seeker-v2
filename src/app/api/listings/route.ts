import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, address, description, price, perks, photos, ownerId } = body;

  if (!ownerId) {
    return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      address,
      description,
      price: parseFloat(price),
      perks,
      photos,
      owner: {
        connect: { id: ownerId }, // ← connect syntax instead of raw ownerId
      },
    },
  });

  return NextResponse.json(listing, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firebaseUid = searchParams.get("uid");

  const listings = await prisma.listing.findMany({
    where: firebaseUid
      ? { owner: { firebaseUid } } // filtered — my listings
      : {}, // no filter — all listings
    orderBy: { createdAt: "desc" },
  });

  const randomizedListings = [...listings].sort(() => Math.random() - 0.5);

  return NextResponse.json(randomizedListings);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, title, address, description, price, perks, photos } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const listing = await prisma.listing.update({
    where: { id },
    data: {
      title,
      address,
      description,
      price: parseFloat(price),
      perks,
      photos,
    },
  });

  return NextResponse.json(listing);
}
