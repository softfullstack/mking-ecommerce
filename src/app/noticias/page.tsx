"use client";

import dynamic from "next/dynamic";

const Noticias = dynamic(() => import("../../views/Noticias"), { ssr: false });

export default function Page() {
  return <Noticias />;
}
