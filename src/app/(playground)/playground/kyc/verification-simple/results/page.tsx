/**
 * Simple KYC Results Page
 * Shows verification status and basic session info
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, RefreshCw, Shield } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

interface SessionData {
  id: string;
  status: string;
  verificationUrl?: string;
  createdAt: string;
  updatedAt: string;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    country?: string;
  };
  diditData?: Record<string, unknown>;
  error?: string;
}

export default function SimpleKYCResultsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-4xl px-4 py-8"><div className="flex items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin" /><span className="ml-2">Loading session...</span></div></div>}>
      <SimpleKYCResultsContent />
    </Suspense>
  );
}

function SimpleKYCResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/didit/sessions-simple/${sessionId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Session not found");
      }

      setSession(data.session);
      setError("");
    } catch (err) {
      console.error("Failed to fetch session:", err);
      setError(err instanceof Error ? err.message : "Failed to load session");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [sessionId, fetchSession]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
      case "created":
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "error":
      case "failed":
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "approved":
        return "default";
      case "pending":
      case "created":
      case "in_progress":
        return "secondary";
      case "error":
      case "failed":
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading session...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/playground/kyc/verification-simple">
            <Button variant="outline">Start New Verification</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Session not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Verification Results</h1>
        <p className="text-muted-foreground">
          Session ID: {session.id}
        </p>
      </div>

      <div className="space-y-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(session.status)}
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant={getStatusVariant(session.status)} className="text-sm">
                {session.status.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSession}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            
            {session.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{session.error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">
                  {new Date(session.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p className="text-muted-foreground">
                  {new Date(session.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-muted-foreground">
                  {session.userData.firstName} {session.userData.lastName}
                </p>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <p className="text-muted-foreground">{session.userData.email}</p>
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span>
                <p className="text-muted-foreground">{session.userData.dateOfBirth}</p>
              </div>
              {session.userData.country && (
                <div>
                  <span className="font-medium">Country:</span>
                  <p className="text-muted-foreground">{session.userData.country}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Verification Details */}
        {session.diditData && (
          <Card>
            <CardHeader>
              <CardTitle>Verification Details</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(session.diditData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/playground/kyc/verification-simple">
            <Button variant="outline">Start New Verification</Button>
          </Link>
          {session.verificationUrl && session.status !== "completed" && (
            <Button asChild>
              <a href={session.verificationUrl} target="_blank" rel="noopener noreferrer">
                Continue Verification
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
