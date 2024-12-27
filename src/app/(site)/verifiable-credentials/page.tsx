import { Card } from "@/components/ui/card";
import { SparklesCore } from "@/components/ui/sparkles";

const useCases = [
  {
    title: "Receive a credential",
    description: "Request and receive a verifiable credential.",
    link: "/verifiable-credentials/obtain",
  },
  {
    title: "Prove it digitally",
    description: "Prove identity and information securely.",
    link: "/verifiable-credentials/prove",
  },
];

export default function VerifiableCredentialsPage() {
  return (
    <div>
      <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <h1 className="md:text-7xl text-4xl lg:text-8xl font-bold text-center text-white relative z-20">
          Verifiable <br className="hidden md:block" />
          Credentials
        </h1>
        <div className="w-[40rem] h-20 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
        <div className="grid grid-cols md:grid-cols-2 gap-8 mt-8">
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

      <div className="p-8"></div>
    </div>
  );
}
