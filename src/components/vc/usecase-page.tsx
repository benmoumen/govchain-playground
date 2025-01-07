"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Suspense } from "react";
import DigitalIdentityCredentialForm from "./digital-identity/form";
import VCConnectionCard from "./vc-connection-card";

interface UseCasePageProps {
  useCase: string;
}

const UseCasePage: React.FC<UseCasePageProps> = ({ useCase }) => {
  return (
    <Tabs defaultValue="connect" className="w-full">
      <TabsList>
        <TabsTrigger value="connect">Connect with the Issuer</TabsTrigger>
        <TabsTrigger value="data">Credential Data</TabsTrigger>
        <TabsTrigger value="request" disabled>
          Request Credential
        </TabsTrigger>
      </TabsList>
      <TabsContent value="connect">
        <Card>
          <CardHeader>
            <CardTitle>Scan the QR code using your Wallet</CardTitle>
            <CardDescription>
              When you connect with the issuer, you will be able to obtain
              credentials and send inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Suspense fallback={<p>Loading...</p>}>
              <VCConnectionCard useCase={useCase} />
            </Suspense>
          </CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="data">
        <DigitalIdentityCredentialForm />
      </TabsContent>
      <TabsContent value="request">
        <p>Request Credential content goes here.</p>
      </TabsContent>
    </Tabs>
  );
};

export default UseCasePage;
