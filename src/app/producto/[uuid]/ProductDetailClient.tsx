"use client";

import dynamic from "next/dynamic";

const ProductDetail = dynamic(() => import("../../../views/ProductDetail"), { ssr: false });

export default function ProductDetailClient() {
  return <ProductDetail />;
}
