"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";

interface WebhookResponse {
  success: boolean;
  status: number;
  data?: unknown;
  error?: string;
}

const samplePayloads = {
  approved: {
    session_id: "11111111-2222-3333-4444-555555555555",
    status: "Approved",
    created_at: Math.floor(Date.now() / 1000),
    timestamp: Math.floor(Date.now() / 1000),
    workflow_id: "11111111-2222-3333-4444-555555555555",
    vendor_data: "test-vendor-data",
    metadata: {
      user_type: "premium",
      account_id: "ABC123",
    },
    decision: {
      session_id: "11111111-2222-3333-4444-555555555555",
      session_number: 12345,
      session_url:
        "https://verify.didit.me/session/11111111-2222-3333-4444-555555555555",
      status: "Approved",
      workflow_id: "11111111-2222-3333-4444-555555555555",
      features: ["ID_VERIFICATION", "LIVENESS"],
      vendor_data: "test-vendor-data",
      callback: "https://example.com/callback",
      id_verification: {
        status: "Approved",
        document_type: "Identity Card",
        document_number: "CAA000000",
        personal_number: "99999999R",
        portrait_image: "https://example.com/portrait.jpg",
        front_image: "https://example.com/front.jpg",
        back_image: "https://example.com/back.jpg",
        full_front_image: "https://example.com/full_front.jpg",
        full_back_image: "https://example.com/full_back.jpg",
        date_of_birth: "1980-01-01",
        age: 44,
        expiration_date: "2031-06-02",
        date_of_issue: "2021-06-02",
        issuing_state: "ESP",
        issuing_state_name: "Spain",
        first_name: "Carmen",
        last_name: "Española",
        full_name: "Carmen Española",
        gender: "F",
        address: "Avda de Madrid 34, Madrid, Madrid",
        formatted_address: "Avda de Madrid 34, Madrid, Madrid 28822, Spain",
        place_of_birth: "Madrid",
        marital_status: "Single",
        nationality: "ESP",
      },
      created_at: "2024-07-24T08:54:25.443172Z",
    },
  },
  declined: {
    session_id: "11111111-2222-3333-4444-555555555555",
    status: "Declined",
    created_at: Math.floor(Date.now() / 1000),
    timestamp: Math.floor(Date.now() / 1000),
    workflow_id: "11111111-2222-3333-4444-555555555555",
    vendor_data: "test-vendor-data",
    metadata: {
      user_type: "premium",
      account_id: "ABC123",
    },
    decision: {
      session_id: "11111111-2222-3333-4444-555555555555",
      session_number: 12345,
      session_url:
        "https://verify.didit.me/session/11111111-2222-3333-4444-555555555555",
      status: "Declined",
      workflow_id: "11111111-2222-3333-4444-555555555555",
      features: ["ID_VERIFICATION"],
      vendor_data: "test-vendor-data",
      callback: "https://example.com/callback",
      reviews: [
        {
          user: "admin@example.com",
          new_status: "Declined",
          comment: "Document appears to be altered",
          created_at: "2024-07-18T13:29:00.366811Z",
        },
      ],
      created_at: "2024-07-24T08:54:25.443172Z",
    },
  },
  inProgress: {
    session_id: "11111111-2222-3333-4444-555555555555",
    status: "In Progress",
    created_at: Math.floor(Date.now() / 1000),
    timestamp: Math.floor(Date.now() / 1000),
    workflow_id: "11111111-2222-3333-4444-555555555555",
    vendor_data: "test-vendor-data",
    metadata: {
      user_type: "premium",
      account_id: "ABC123",
    },
  },
};

export default function DidItWebhookTestPage() {
  const [payload, setPayload] = useState(
    JSON.stringify(samplePayloads.approved, null, 2)
  );
  const [response, setResponse] = useState<WebhookResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sendWebhook = async () => {
    setLoading(true);
    try {
      const parsedPayload = JSON.parse(payload);

      // Generate signature server-side for security
      const signatureResponse = await fetch("/api/didit/webhook/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: parsedPayload }),
      });

      if (!signatureResponse.ok) {
        const errorData = await signatureResponse.json();
        throw new Error(errorData.error || "Failed to generate signature");
      }

      const { signature, timestamp, updatedPayload } =
        await signatureResponse.json();

      // Send the webhook with the generated signature
      const result = await fetch("/api/didit/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Signature": signature,
          "X-Timestamp": timestamp.toString(),
        },
        body: JSON.stringify(updatedPayload),
      });

      const responseData = await result.json();

      setResponse({
        success: result.ok,
        status: result.status,
        data: responseData,
      });
    } catch (error) {
      setResponse({
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    setLoading(false);
  };

  const loadSamplePayload = (type: keyof typeof samplePayloads) => {
    setPayload(JSON.stringify(samplePayloads[type], null, 2));
    setResponse(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "Declined":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Declined
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "In Review":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            In Review
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Didit Webhook Tester</h1>
        <p className="text-muted-foreground">
          Test the Didit identity verification webhook endpoint with sample
          payloads. HMAC signatures are generated securely server-side.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhook Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Payload</CardTitle>
              <CardDescription>
                Edit the JSON payload or use one of the sample payloads below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="payload">JSON Payload</Label>
                <Textarea
                  id="payload"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="font-mono text-sm min-h-[300px]"
                  placeholder="Enter webhook payload JSON..."
                />
              </div>

              <div className="space-y-2">
                <Label>Sample Payloads</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSamplePayload("approved")}
                  >
                    {getStatusBadge("Approved")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSamplePayload("declined")}
                  >
                    {getStatusBadge("Declined")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSamplePayload("inProgress")}
                  >
                    {getStatusBadge("In Progress")}
                  </Button>
                </div>
              </div>

              <Button
                onClick={sendWebhook}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Send Webhook"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Response */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Response</CardTitle>
              <CardDescription>
                The response from the webhook endpoint will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={response.success ? "default" : "destructive"}
                    >
                      {response.success ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {response.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {response.success ? "Success" : "Error"}
                    </span>
                  </div>

                  <div>
                    <Label>Response Data</Label>
                    <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-[400px]">
                      {response.error
                        ? response.error
                        : JSON.stringify(response.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Send a webhook to see the response</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <strong>Endpoint:</strong> <code>/api/didit/webhook</code>
              </div>
              <div>
                <strong>Method:</strong> POST
              </div>
              <div>
                <strong>Headers:</strong> X-Signature, X-Timestamp
              </div>
              <div>
                <strong>Security:</strong> HMAC SHA-256 verification
              </div>
              <div className="text-green-600">
                <strong>✓ Secure:</strong> Signatures generated server-side
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
