"use client";
import Admin from "@/pages/Admin";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Admin />
    </Suspense>
  );
}


