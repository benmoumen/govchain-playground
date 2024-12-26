import { Button } from "@/components/ui/button";

export default function RequestVCPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        Request Verifiable Credentials
      </h1>
      <p className="text-gray-700 mt-4">
        Discover how digital wallets request Verifiable Credentials securely
        across sectors.
      </p>
      <ol className="list-decimal mt-6 pl-8">
        <li>Open your wallet application.</li>
        <li>Navigate to `Request Credentials`.</li>
        <li>Provide the necessary details and submit your request.</li>
      </ol>
      <Button className="mt-6">Simulate Interaction</Button>
    </div>
  );
}
