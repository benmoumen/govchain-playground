import * as motion from "motion/react-client";
import { PinContainer } from "@/components/ui/3d-pin";

export default function Home() {
  const experiments = [
    {
      name: "Prove It Digitally",
      description:
        "Use verifiable credentials to securely prove your identity or qualifications online, instantly and tamper-proof.",
      link: "/verifiable-credentials",
    },
    {
      name: "Tokenized Ownership",
      description:
        "Represent company shares as blockchain tokens, making ownership transparent, transferable, and efficient.",
      link: "#",
    },
    {
      name: "Smart Governance",
      description:
        "Enable shareholders to vote on proposals directly through their wallets, automating governance processes.",
      link: "#",
    },
    {
      name: "Effortless Transfers",
      description:
        "Seamlessly transfer ownership of shares or assets between wallets with blockchain’s security.",
      link: "#",
    },
    {
      name: "Digital Identity for Transactions",
      description:
        "Link your blockchain wallet to your verified identity, enabling trusted and authenticated digital interactions.",
      link: "#",
    },
    {
      name: "On-Chain Records",
      description:
        "Store company registration and updates directly on the blockchain for transparency and auditability.",
      link: "#",
    },
    {
      name: "Decentralized Incentives",
      description:
        "Create and distribute token-based rewards to drive engagement and innovation in your ecosystem.",
      link: "#",
    },
    {
      name: "Credential-Backed Access",
      description:
        "Use verifiable credentials to grant or restrict access to services or platforms, ensuring trust and compliance.",
      link: "#",
    },
  ];
  return (
    <main>
      <section className="container grid items-center gap-6 py-20 md:py-104">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tighter text-primary">
            Unlock new possibilities <br className="hidden sm:inline" />
            with verifiable credentials and NFT tokens
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            See how digital wallets make proving your credentials online and
            trading company shares as tokens secure, seamless, and possible for
            the first time.
          </p>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0.0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="container grid items-center gap-6 pb-8 pt-6 md:py-104"
      >
        <div className="h-[40rem] flex items-start justify-start">
          {experiments.map((experiment, index) => (
            <PinContainer
              key={index}
              title={experiment.name}
              href={experiment.link}
            >
              <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                  {experiment.name}
                </h3>
                <div className="text-base !m-0 !p-0 font-normal">
                  <span className="text-slate-500 ">
                    {experiment.description}
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
              </div>
            </PinContainer>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
