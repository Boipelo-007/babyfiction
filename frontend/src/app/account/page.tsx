"use client";
import Link from "next/link";
import { useCurrentUser } from "@/lib/auth";
import RequireAuth from "@/components/RequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
  return (
    <RequireAuth redirectTo="/auth/login">
      <AccountInner />
    </RequireAuth>
  );
}

function AccountInner() {
  const { user } = useCurrentUser();

  return (
    <div className="mx-auto max-w-4xl space-y-6 pt-24 pb-16 px-6