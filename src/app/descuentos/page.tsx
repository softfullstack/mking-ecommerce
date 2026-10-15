"use client";

import dynamic from "next/dynamic";

const Descuentos = dynamic(() => import("../../views/DescuentosEmpresas"), { ssr: false });

export default function Page() {
  return <Descuentos />;
}
