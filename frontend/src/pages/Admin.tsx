"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth";
import { getAuthToken } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, ArrowUp, ArrowDown, History as HistoryIcon, Star as StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Types for user analytics
type UserAnalytics = {
  totalUsers: number;
  newUsersLast7Days: number;
  activeUsers: number;
  usersByPlan: {
    free: number;
    premium: number;
    enterprise: number;
  };
};

export default function Admin() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching analytics from:', '/api/admin/analytics/users');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://babyfiction.onrender.com';
        const response = await fetch(`${API_URL}/api/admin/analytics/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch analytics');
        }
        
        console.log('Analytics data received:', data);
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Failed to load analytics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAnalytics();
    } else {
      setIsLoading(false);
      setError('Unauthorized access');
    }
  }, [user]);

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

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Calculate percentage change
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Render loading skeleton
  const renderSkeleton = (count = 1) => (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 pt-24 pb-16 px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              {isLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <h3 className="text-2xl font-bold">{formatNumber(analytics?.totalUsers || 0)}</h3>
              )}
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          {!isLoading && !error && analytics && analytics.newUsersLast7Days !== undefined && (
            <div className="mt-4 flex items-center text-sm">
              {analytics.newUsersLast7Days >= 0 ? (
                <span className="flex items-center text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  {analytics.newUsersLast7Days} new this week
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  {Math.abs(analytics.newUsersLast7Days)} fewer this week
                </span>
              )}
            </div>
          )}
        </Card>

        {/* Active Users Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              {isLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <h3 className="text-2xl font-bold">{formatNumber(analytics?.activeUsers || 0)}</h3>
              )}
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Active in last 30 days</p>
        </Card>

        {/* User Plans Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">User Plans</h3>
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <div className="space-y-3">
              {analytics?.usersByPlan && (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Free</span>
                      <span className="font-medium">{analytics.usersByPlan.free || 0}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ 
                          width: `${(analytics.usersByPlan.free || 0) / (analytics.totalUsers || 1) * 100}%`,
                          minWidth: '4px'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Premium</span>
                      <span className="font-medium">{analytics.usersByPlan.premium || 0}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ 
                          width: `${(analytics.usersByPlan.premium || 0) / (analytics.totalUsers || 1) * 100}%`,
                          minWidth: '4px'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Enterprise</span>
                      <span className="font-medium">{analytics.usersByPlan.enterprise || 0}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ 
                          width: `${(analytics.usersByPlan.enterprise || 0) / (analytics.totalUsers || 1) * 100}%`,
                          minWidth: '4px'
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>

        {/* Recent Activity Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Recent Activity</h3>
            <HistoryIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2 w-1/2" />
                  </div>
                </div>
              ))
            ) : error ? (
              <p className="text-red-500 text-sm">Error loading activity</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <StarIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New review submitted</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Main Grid */}
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
