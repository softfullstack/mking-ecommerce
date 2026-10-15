"use client";

import dynamic from "next/dynamic";

const Ubicaciones = dynamic(() => import("../../views/Ubicaciones"), { ssr: false });

export default function Page() {
  return <Ubicaciones />;
}
