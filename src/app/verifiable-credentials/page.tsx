import { Card } from "@/components/ui/card";

const useCases = [
  {
    title: "Receive a credential",
    description: "Request and receive a verifiable credential.",
    link: "/verifiable-credentials/request-vc",
  },
  {
    title: "Prove it digitally",
    description: "Prove identity and information securely.",
    link: "/use-cases/present-vc",
  },
];

export default function VerifiableCredentialsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Verifiable Credentials
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {useCases.map((item, index) => (
          <Card key={index} className="p-4 shadow-md">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <a
              href={item.link}
              className="text-blue-600 mt-4 inline-block font-medium"
            >
              Learn More →
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
