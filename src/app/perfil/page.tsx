"use client";

import dynamic from "next/dynamic";
import ProtectedRoute from "../../components/ProtectedRoute";

const Profile = dynamic(() => import("../../views/Profile"), { ssr: false });

export default function Page() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}
