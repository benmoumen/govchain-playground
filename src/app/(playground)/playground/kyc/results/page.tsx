/**
 * KYC Results Page
 * Shows verification status and basic session info
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  RefreshCw,
  Shield,
  User,
} from "lucide-react";
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
  diditData?: {
    session_id?: string;
    session_number?: number;
    workflow_id?: string;
    features?: string[];
    vendor_data?: string;
    metadata?: Record<string, unknown>;
    callback?: string;
    id_verification?: {
      status: string;
      document_type: string;
      document_number: string;
      personal_number?: string;
      first_name: string;
      last_name: string;
      full_name: string;
      date_of_birth: string;
      age: number;
      gender: string;
      nationality: string;
      issuing_state: string;
      issuing_state_name: string;
      expiration_date: string;
      date_of_issue: string;
      address: string;
      place_of_birth: string;
      marital_status: string;
      portrait_image?: string;
      front_image?: string;
      warnings?: Array<{
        feature: string;
        risk: string;
        short_description: string;
        long_description: string;
      }>;
    };
    liveness?: {
      status: string;
      method: string;
      score: number;
      age_estimation?: number;
      warnings?: Array<{
        feature: string;
        risk: string;
        short_description: string;
      }>;
    };
    face_match?: {
      status: string;
      score: number;
    };
    ip_analysis?: {
      status: string;
      ip_country: string;
      ip_city: string;
      device_brand: string;
      device_model: string;
      browser_family: string;
      os_family: string;
      platform: string;
      is_vpn_or_tor: boolean;
    };
    created_at?: string;
  };
  error?: string;
}

export default function KYCResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading session...</span>
          </div>
        </div>
      }
    >
      <KYCResultsContent />
    </Suspense>
  );
}

function KYCResultsContent() {
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
      const response = await fetch(`/api/didit/sessions/${sessionId}`);

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

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
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
          <Link href="/playground/kyc/verification">
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
        <p className="text-muted-foreground">Session ID: {session.id}</p>
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
              <Badge
                variant={getStatusVariant(session.status)}
                className="text-sm"
              >
                {session.status.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSession}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
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
                <p className="text-muted-foreground">
                  {session.userData.email}
                </p>
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span>
                <p className="text-muted-foreground">
                  {session.userData.dateOfBirth}
                </p>
              </div>
              {session.userData.country && (
                <div>
                  <span className="font-medium">Country:</span>
                  <p className="text-muted-foreground">
                    {session.userData.country}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Verification Results */}
        {session.diditData && (
          <>
            {/* Identity Verification Details */}
            {session.diditData.id_verification && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Identity Verification
                    <Badge
                      variant={
                        session.diditData.id_verification.status === "Approved"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {session.diditData.id_verification.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Verified Identity */}
                  <div>
                    <h4 className="font-medium mb-3">Verified Identity</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium">Full Name:</span>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.full_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Age:</span>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.age} years old
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Gender:</span>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.gender === "M"
                            ? "Male"
                            : session.diditData.id_verification.gender === "F"
                              ? "Female"
                              : session.diditData.id_verification.gender}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Nationality:
                        </span>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.nationality}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Place of Birth:
                        </span>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.place_of_birth}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Marital Status:
                        </span>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.marital_status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Document Information */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Document Information
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium">
                          Document Type:
                        </span>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.document_type}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Document Number:
                        </span>
                        <p className="text-muted-foreground font-mono">
                          {session.diditData.id_verification.document_number}
                        </p>
                      </div>
                      {session.diditData.id_verification.personal_number && (
                        <div>
                          <span className="text-sm font-medium">
                            Personal Number:
                          </span>
                          <p className="text-muted-foreground font-mono">
                            {session.diditData.id_verification.personal_number}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium">
                          Issuing State:
                        </span>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.issuing_state_name}{" "}
                          ({session.diditData.id_verification.issuing_state})
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Issue Date:</span>
                        <p className="text-muted-foreground">
                          {new Date(
                            session.diditData.id_verification.date_of_issue
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Expiration Date:
                        </span>
                        <p className="text-muted-foreground">
                          {new Date(
                            session.diditData.id_verification.expiration_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  {session.diditData.id_verification.address && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                        </h4>
                        <p className="text-muted-foreground">
                          {session.diditData.id_verification.address}
                        </p>
                      </div>
                    </>
                  )}

                  {/* ID Verification Warnings */}
                  {session.diditData.id_verification.warnings &&
                    session.diditData.id_verification.warnings.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            Security Warnings
                          </h4>
                          <div className="space-y-2">
                            {session.diditData.id_verification.warnings.map(
                              (warning, index) => (
                                <Alert
                                  key={index}
                                  className="border-yellow-200"
                                >
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  <AlertDescription>
                                    <span className="font-medium">
                                      {warning.short_description}
                                    </span>
                                    <br />
                                    <span className="text-sm text-muted-foreground">
                                      {warning.long_description}
                                    </span>
                                  </AlertDescription>
                                </Alert>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Verification Features & Scores */}
            {(session.diditData.liveness || session.diditData.face_match) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Biometric Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Liveness Check */}
                  {session.diditData.liveness && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Liveness Detection</h4>
                        <Badge
                          variant={
                            session.diditData.liveness.status === "Approved"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {session.diditData.liveness.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium">
                            Confidence Score:
                          </span>
                          <div className="mt-2">
                            <div className="flex items-center gap-3">
                              <Progress
                                value={session.diditData.liveness.score}
                                className="flex-1"
                              />
                              <span className="text-sm font-mono">
                                {session.diditData.liveness.score.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Method:</span>
                          <p className="text-muted-foreground">
                            {session.diditData.liveness.method}
                          </p>
                        </div>
                        {session.diditData.liveness.age_estimation && (
                          <div>
                            <span className="text-sm font-medium">
                              Estimated Age:
                            </span>
                            <p className="text-muted-foreground">
                              {session.diditData.liveness.age_estimation.toFixed(
                                0
                              )}{" "}
                              years
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Face Match */}
                  {session.diditData.face_match && (
                    <>
                      {session.diditData.liveness && <Separator />}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Face Match</h4>
                          <Badge
                            variant={
                              session.diditData.face_match.status === "Approved"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {session.diditData.face_match.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            Match Confidence:
                          </span>
                          <div className="mt-2">
                            <div className="flex items-center gap-3">
                              <Progress
                                value={session.diditData.face_match.score}
                                className="flex-1"
                              />
                              <span className="text-sm font-mono">
                                {session.diditData.face_match.score.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Biometric Warnings */}
                  {session.diditData.liveness?.warnings &&
                    session.diditData.liveness.warnings.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            Liveness Warnings
                          </h4>
                          <div className="space-y-2">
                            {session.diditData.liveness.warnings.map(
                              (warning, index) => (
                                <Alert
                                  key={index}
                                  className="border-yellow-200"
                                >
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  <AlertDescription>
                                    <span className="font-medium">
                                      {warning.short_description}
                                    </span>
                                  </AlertDescription>
                                </Alert>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Technical Information */}
            {session.diditData.ip_analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <span className="text-sm font-medium">Location:</span>
                      <p className="text-muted-foreground">
                        {session.diditData.ip_analysis.ip_city},{" "}
                        {session.diditData.ip_analysis.ip_country}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Device:</span>
                      <p className="text-muted-foreground">
                        {session.diditData.ip_analysis.device_brand}{" "}
                        {session.diditData.ip_analysis.device_model}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Platform:</span>
                      <p className="text-muted-foreground">
                        {session.diditData.ip_analysis.os_family} (
                        {session.diditData.ip_analysis.platform})
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Browser:</span>
                      <p className="text-muted-foreground">
                        {session.diditData.ip_analysis.browser_family}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">VPN/Tor:</span>
                      <Badge
                        variant={
                          session.diditData.ip_analysis.is_vpn_or_tor
                            ? "destructive"
                            : "default"
                        }
                      >
                        {session.diditData.ip_analysis.is_vpn_or_tor
                          ? "Detected"
                          : "Not Detected"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Information */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {session.diditData.session_id && (
                    <div>
                      <span className="text-sm font-medium">Session ID:</span>
                      <p className="text-muted-foreground font-mono text-sm">
                        {session.diditData.session_id}
                      </p>
                    </div>
                  )}
                  {session.diditData.session_number && (
                    <div>
                      <span className="text-sm font-medium">
                        Session Number:
                      </span>
                      <p className="text-muted-foreground">
                        #{session.diditData.session_number}
                      </p>
                    </div>
                  )}
                  {session.diditData.workflow_id && (
                    <div>
                      <span className="text-sm font-medium">Workflow ID:</span>
                      <p className="text-muted-foreground font-mono text-sm">
                        {session.diditData.workflow_id}
                      </p>
                    </div>
                  )}
                  {session.diditData.features && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <span className="text-sm font-medium">
                        Verification Features:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {session.diditData.features.map((feature, index) => (
                          <Badge key={index} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {session.diditData.created_at && (
                    <div>
                      <span className="text-sm font-medium">Completed:</span>
                      <p className="text-muted-foreground">
                        {new Date(
                          session.diditData.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Legacy Verification Details - only show if no enhanced data */}
        {session.diditData && !session.diditData.id_verification && (
          <Card>
            <CardHeader>
              <CardTitle>Raw Verification Data</CardTitle>
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
          <Link href="/playground/kyc/verification">
            <Button variant="outline">Start New Verification</Button>
          </Link>
          {session.verificationUrl && session.status !== "completed" && (
            <Button asChild>
              <a
                href={session.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Continue Verification
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
