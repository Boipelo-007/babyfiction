"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAuthToken } from "@/lib/api";

export default function ApiDebugger() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://babyfiction.onrender.com";
      
      console.log("Testing endpoint:", `${API_URL}${endpoint}`);
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "No token");
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      
      setResults({
        endpoint,
        status: response.status,
        ok: response.ok,
        data,
        apiUrl: API_URL,
        hasToken: !!token,
      });
    } catch (error: any) {
      setResults({
        endpoint,
        error: error.message,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 m-6">
      <h2 className="text-xl font-bold mb-4">API Debugger</h2>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm">
          <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "https://babyfiction.onrender.com"}
        </p>
        <p className="text-sm">
          <strong>Token:</strong> {getAuthToken() ? "✓ Present" : "✗ Missing"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={() => testEndpoint("/api/health")}
          disabled={loading}
          variant="outline"
        >
          Test Health
        </Button>
        <Button
          onClick={() => testEndpoint("/api/auth/me")}
          disabled={loading}
          variant="outline"
        >
          Test Auth
        </Button>
        <Button
          onClick={() => testEndpoint("/api/admin/analytics/users")}
          disabled={loading}
          variant="outline"
        >
          Test Admin Analytics
        </Button>
        <Button
          onClick={() => testEndpoint("/api/admin/users")}
          disabled={loading}
          variant="outline"
        >
          Test Admin Users
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Testing...</p>}

      {results && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Results:</h3>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
}
