import React from "react";
import MainLayout from "../layouts/admin/MainLayout";

export default async function AdminTemplate() {
  const fetchProducts = async () => {
    const response = await fetch("http://localhost:3000/api/product", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await response.json();
    return data.data;
  };

  const fetchTotalProducts = async () => {
    const response = await fetch("http://localhost:3000/api/product", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await response.json();
    return data.total;
  };

  const fetchBrands = async () => {
    const response = await fetch("http://localhost:3000/api/brand", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return data.data;
  };

  const [getProducts, getBrands, totalProducts] = await Promise.all([
    fetchProducts(),
    fetchBrands(),
    fetchTotalProducts(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] px-8 py-14 text-white">
      <MainLayout
        products={getProducts}
        totalProducts={totalProducts}
        brands={getBrands}
      />
    </div>
  );
}
