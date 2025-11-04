"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/auth/login");
      else if (user.role !== "admin") router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pt-24 pb-16 px-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back! Use the links below to manage the store.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Create, edit, and manage products.
          </p>
          <div className="flex gap-3">
            <Link href="/admin/products">
              <Button variant="outline">Manage Products</Button>
            </Link>
            <Link href="/admin/products/new">
              <Button>Add Product</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-sm text-muted-foreground mb-4">
            View and update customer orders.
          </p>
          <div>
            <Link href="/admin/orders">
              <Button variant="outline">View Orders</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
