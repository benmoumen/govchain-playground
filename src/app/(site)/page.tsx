import { Hero } from "@/components/blocks/hero-with-orb-effect";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <main>
      <Hero
        mainHeading={
          <>
            The Digital Wallet: <br className="sm:hidden block" />A New Era of
            Trust
          </>
        }
        tagline="Receive government-issued credentials and use them as trusted digital proofs for critical services. Moreover, tokenize your company and use your wallet to manage your shares with ease."
        buttonLabel="Let's Explore"
        buttonHref="/playground"
        caption=""
      />
      <BackgroundBeams />

      {/* <motion.section
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
      </motion.section> */}
    </main>
  );
}
