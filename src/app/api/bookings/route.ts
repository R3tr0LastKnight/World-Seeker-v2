import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, listingId, startDate, endDate } = body;

    if (!userId || !listingId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const createdBooking = await tx.booking.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          listing: {
            connect: {
              id: listingId,
            },
          },
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });

      // Get existing booked users
      const listing = await tx.listing.findUnique({
        where: {
          id: listingId,
        },
        select: {
          bookedByIds: true,
        },
      });

      // Add user to bookedByIds only once
      if (listing && !listing.bookedByIds.includes(userId)) {
        await tx.listing.update({
          where: {
            id: listingId,
          },
          data: {
            bookedByIds: {
              push: userId,
            },
          },
        });
      }

      return createdBooking;
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create booking",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const listingId = searchParams.get("listingId");
  const userId = searchParams.get("userId");

  // Existing heatmap endpoint
  if (listingId && !userId) {
    const bookings = await prisma.booking.findMany({
      where: {
        listingId,
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    const counts: Record<string, number> = {};

    bookings.forEach((booking) => {
      const current = new Date(booking.startDate);

      while (current <= booking.endDate) {
        const key = current.toISOString().split("T")[0];

        counts[key] = (counts[key] || 0) + 1;

        current.setDate(current.getDate() + 1);
      }
    });

    return NextResponse.json(counts);
  }

  // User bookings
  if (userId) {
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        listing: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(bookings);
  }

  return NextResponse.json([]);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const { bookingId, startDate, endDate } = body;

    if (!bookingId || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update booking",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        {
          error: "bookingId required",
        },
        {
          status: 400,
        },
      );
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          error: "Booking not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete booking",
      },
      {
        status: 500,
      },
    );
  }
}
