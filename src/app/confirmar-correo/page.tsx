"use client";

import dynamic from "next/dynamic";

const ConfirmEmail = dynamic(() => import("../../views/ConfirmEmail"), { ssr: false });

export default function Page() {
  return <ConfirmEmail />;
}
