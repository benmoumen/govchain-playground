import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DigitalIdentityCredentialForm from "../digital-identity-credential-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepForward } from "lucide-react";

const UseCase: React.FC = () => {
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
            <p>Connect with the Issuer content goes here.</p>
          </CardContent>
          <CardFooter>
            <Button size={"sm"} variant={"outline"}>
              <StepForward></StepForward>Next
            </Button>
          </CardFooter>
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

export default UseCase;
