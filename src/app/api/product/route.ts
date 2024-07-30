import { Product } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageNum = parseInt(searchParams.get("page") ?? "0", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  const product = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      brandId: true,
      brand: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: pageNum * pageSize,
    take: Number(pageSize),
  });

  const total = await db.product.count();

  return NextResponse.json(
    { data: product, total: total, message: "Get product successfully" },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  try {
    const body: Product = await req.json();
    const product = await db.product.create({
      data: {
        title: body.title,
        price: Number(body.price),
        brandId: body.brandId,
      },
    });

    return NextResponse.json(
      {
        data: product,
        message: "Create product successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Create product failed" },
      { status: 500 },
    );
  }
}
