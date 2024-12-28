import { Button } from "@/components/ui/button";

export default function PresentVCPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-600">
        Present Verifiable Credentials
      </h1>
      <p className="text-gray-700 mt-4">
        Learn how to present your Verifiable Credentials securely and
        efficiently.
      </p>
      <ol className="list-decimal mt-6 pl-8">
        <li>Open your wallet application.</li>
        <li>Navigate to `Present Credentials`.</li>
        <li>Select the credentials you wish to present and confirm.</li>
      </ol>
      <Button className="mt-6">Simulate Presentation</Button>
    </div>
  );
}
