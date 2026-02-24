import { TypewriterEffect } from "../components/ui/typewriter-effect";

const Home = () => {
  return <div className="px-6 mb-12 my-2 md:px-12 lg:px-16 py-16 md:pt-12 pb-0 max-w-4xl mx-auto text-center flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
    <div className="animate-fade-in mx-auto w-full">
      {/* <h1 className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[4.5rem] font-display font-black mb-12 min-h-[1.5em] leading-[1.1] tracking-tight">
        <TypewriterEffect text="Welcome to the other side" typingDelay={80} deletingDelay={30} cursor={true} cursorCharacter="_" />
      </h1> */}

      <p className="text-sm md:text-base font-body tracking-[0.05em] mb-16 text-foreground min-h-[1.5em] max-w-[860px] mx-auto uppercase lg:text-[2rem]">
        <TypewriterEffect
          text={[
            "Welcome to the other side",
            "I am known as kygra",
            "I am a ghost in the machine",
            "I build digital artifacts",
            "I seek the signal and kill the noise",
          ]}
          startDelay={500}
          typingDelay={100}
          deletingDelay={50}
          delay={200}
          cursor={true}
          cursorCharacter="|"
          smartBackspace={true}
          loop={true}
        />
      </p>

      <div className="space-y-10 text-[1.1rem] sm:text-[1.2rem] md:text-[1.35rem] font-body tracking-[0.06em] uppercase text-foreground leading-[1.8] max-w-[700px] mx-auto text-center">
        <p>
          I am a man out of time, witnessing the world as it was and as it is. I am happily unemployed, refusing to trade my best years for a salary that supports a wasteful existence.
        </p>
        <p>
          I sustain myself by the land and the markets, answering only to necessity. I work for myself and the betterment of others, finding freedom in having few costs and no master.
        </p>
        <p>
          I view technology with skepticism and suspicion. It is a good servant but a terrible master; embedding itself into the fabric of our civilization and souls, I'm betting it will grow to become a <span className="text-secondary-foreground bg-secondary px-2">force of opression</span> against our freedoms.
        </p>
      </div>

    </div>
  </div>;
};
export default Home;
