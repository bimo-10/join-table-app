import { Brand } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
  const brand = await db.brand.findMany({});

  return NextResponse.json(
    { data: brand, message: "Get brand successfully" },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  try {
    const body: Brand = await req.json();

    const brand = await db.brand.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      { data: brand, message: "Create brand successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Create brand failed" },
      { status: 500 },
    );
  }
}
