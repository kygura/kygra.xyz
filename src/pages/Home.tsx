import { TypewriterEffect } from "../components/ui/typewriter-effect";

const Home = () => {
  return <div className="px-6 mb-12 my-2 md:px-12 lg:px-16 py-16 md:pt-12 pb-0 max-w-4xl mx-auto text-center">
    <div className="prose-minimal animate-fade-in mx-auto">
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-light mb-8 h-[1.2em]">
        <TypewriterEffect text="Welcome friend" typingDelay={70}
          deletingDelay={30} cursor={true} cursorCharacter="_" />
      </h1>

      <p className="text-xl md:text-2xl font-light italic mb-12 text-muted-foreground min-h-[1.5em]">
        <TypewriterEffect
          text={[
            "I am known as kygra.",
            "I am a ghost in the machine.",
            "I build digital artifacts.",
            "I seek the signal and kill the noise.",
          ]}
          typingDelay={100}
          deletingDelay={50}
          delay={2000}
          cursor={true}
          cursorCharacter="|"
          startDelay={1600}
          smartBackspace={true}
          loop={true}
        />
      </p>

      <div className="space-y-6 text-lg leading-relaxed">
        <p>
          I am a man out of time, witnessing the world as it was and as it is. I am happily unemployed, refusing to trade my best years for a salary that supports a wasteful existence.
        </p>
        <p>
          I sustain myself by the land and the markets, answering only to necessity. I work for myself and the betterment of others, finding freedom in having few costs and no master.
        </p>
        <p>
          I view technology with skepticism and suspicion. It is a good servant but a terrible master; embedding itself into the fabric of our civilization and souls, I'm betting it will grow to become a force of opression against our freedoms.
        </p>

      </div>

    </div>
  </div>;
};
export default Home;
