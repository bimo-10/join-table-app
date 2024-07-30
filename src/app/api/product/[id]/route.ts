import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const product = await db.product.findFirst({
    where: {
      id,
    },
  });
  return NextResponse.json(
    { data: product, message: "Get product successfully" },
    { status: 200 },
  );
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  try {
    const body = await req.json();

    const product = await db.product.update({
      where: {
        id: id,
      },
      data: {
        title: body.title,
        price: Number(body.price),
        brandId: body.brandId,
      },
    });

    return NextResponse.json(
      {
        data: product,
        message: "Update product successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  try {
    const product = await db.product.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      {
        data: product,
        message: "Delete product successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
  }
}
