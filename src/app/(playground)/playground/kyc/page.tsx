/**
 * Simplified KYC Verification Page
 * Follows minimal Didit API flow with clean UI
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/data/countries";
import type { UserKYCData } from "@/types/didit/session";
import { AlertCircle, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber?: string;
  country: string;
}

export default function KYCVerificationPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    country: "LSO",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.dateOfBirth) {
      setError("Date of birth is required");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const userData: UserKYCData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber?.trim(),
        country: formData.country,
      };

      const response = await fetch("/api/didit/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to create verification session"
        );
      }

      const { session } = await response.json();

      if (!session?.verificationUrl) {
        throw new Error("No verification URL received");
      }

      toast.success("Verification session created successfully!");

      // Redirect to Didit verification
      window.location.href = session.verificationUrl;
    } catch (error) {
      console.error("Verification error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to start verification"
      );
      toast.error("Failed to start verification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-8 lg:py-10">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant={"outline"} size={"xs"} className="uppercase">
                KYC
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Verify Your Identity
              </h2>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide your personal details for identity verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="Enter phone number (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="bg-gradient-to-b from-brand to-brand/80 hover:from-brand/90 hover:to-brand/70 text-white relative overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-brand/30 hover:ring-offset-2 shadow-lg hover:shadow-xl"
                  effect="expandIcon"
                  icon={ArrowRightIcon}
                  iconPlacement="right"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Session..." : "Start Verification"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold">What happens next?</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                {" "}
                • You&apos;ll be redirected to the secure verification portal
              </li>
              <li>• Follow the instructions to upload your ID document</li>
              <li>• Complete any additional verification steps</li>
              <li>• Return here once verification is complete</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
