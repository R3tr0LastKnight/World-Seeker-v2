import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const firebaseUid = req.headers.get("x-firebase-uid");

    if (!firebaseUid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        firebaseUid,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // Trips = bookings made by this user
    const trips = await prisma.booking.count({
      where: {
        userId,
      },
    });

    // Locations = listings created by this user
    const locations = await prisma.listing.count({
      where: {
        ownerId: userId,
      },
    });

    // Bookings = total bookings received on user's listings
    const bookings = await prisma.booking.count({
      where: {
        listing: {
          ownerId: userId,
        },
      },
    });

    return NextResponse.json({
      trips,
      bookings,
      locations,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch stats",
      },
      {
        status: 500,
      },
    );
  }
}
