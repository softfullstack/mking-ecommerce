"use client";

import dynamic from "next/dynamic";

const Novedades = dynamic(() => import("../../views/Novedades"), { ssr: false });

export default function Page() {
  return <Novedades />;
}
