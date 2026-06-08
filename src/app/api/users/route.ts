import { NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = await adminAuth.verifyIdToken(token);

    const user = await prisma.user.upsert({
      where: {
        email: decoded.email!,
      },

      update: {
        name: decoded.name,
        image: decoded.picture,
      },

      create: {
        firebaseUid: decoded.uid,
        email: decoded.email!,
        name: decoded.name,
        image: decoded.picture,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
