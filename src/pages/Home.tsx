import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TypewriterEffect } from "../components/ui/typewriter-effect";

const Home = () => {
  const words = ['TRADER', 'BUILDER', 'READER', 'MUSICIAN', "NOBODY'S EMPLOYEE", 'STILL FIGURING IT OUT'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsFading(false);
      }, 350); // wait for fade out
    }, 2800);
    return () => clearInterval(cycleInterval);
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-0 bg-background text-foreground relative z-10 font-['Courier_Prime']">
      {/* HERO BLOCK */}
      <div className="md:col-span-2 p-6 md:p-8 md:pr-12 md:border-r-2 border-foreground relative border-b-2 md:border-b-0 border-foreground">
        <div className="mb-8 relative z-10 mt-2">
          <h1 className="font-['Bebas_Neue'] text-3xl md:text-5xl lg:text-5xl text-foreground leading-[1.2] tracking-wider mb-2 min-h-[1.2em]">
            <TypewriterEffect text="Welcome friend" typingDelay={70} deletingDelay={30} cursor={true} cursorCharacter="_" />
          </h1>
          <div className="font-['Courier_Prime'] text-[0.85rem] md:text-[0.95rem] leading-[1.7] max-w-[520px] text-muted-foreground italic min-h-[1.5em]">
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
          </div>
        </div>

        <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] mb-6 text-foreground relative z-10 mt-8">
          I am a<br />
          <span className="text-destructive relative">reader</span> of<br />
          <span className="relative after:content-[''] after:absolute after:bottom-1 md:after:bottom-2 after:left-0 after:right-0 after:h-[2px] md:after:h-[3px] after:bg-foreground">hidden</span><br />
          order.
        </h2>

        <div className="text-[0.85rem] md:text-[0.95rem] leading-[1.7] max-w-[520px] text-foreground space-y-4 relative z-10">
          <p>
            Five years of compounding edge — reading regimes, timing exits,
            surviving the parts they don't write books about.
            Discretionary. Derivatives. The kind of work that happens
            in silence and shows up as a number.
          </p>
          <p>
            I build things to understand them. Systems, interfaces,
            agents — not as a career but as a mode of thinking.
            The market is one language. Code is another.
            Music is what happens when words run out.
          </p>
          <p>
            No employer. No pitch deck. No mission statement.
            Pull up a chair.
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-dashed border-muted relative z-10">
          <div className="font-['Bebas_Neue'] text-2xl sm:text-3xl md:text-4xl text-foreground tracking-[0.1em] min-h-[2.4rem]">
            <span
              className={`inline-block transition-all duration-300 ${isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}
            >
              {words[currentWordIndex]}
            </span>
          </div>
        </div>

      </div>

      {/* SIDEBAR */}
      <div className="md:col-start-3 md:col-end-4 md:row-span-2 p-6 md:p-8 md:border-l-2 border-foreground relative border-b-2 md:border-b-0">
        <div className="mb-10 pb-8 border-b border-dashed border-muted">
          <ul className="list-none space-y-0">
            {['Writings', 'Projects', 'Artifacts'].map(item => (
              <li key={item} className="border-b border-foreground/15 py-2">
                <Link to={`/${item.toLowerCase()}`} className="font-['Special_Elite'] text-base text-foreground no-underline flex justify-between items-center transition-colors hover:text-destructive after:content-['→'] after:opacity-40 after:font-mono">
                  {item === 'Projects' ? 'Software' : item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-10 pb-8 border-b border-dashed border-muted relative">
          <p className="font-['Special_Elite'] text-[1.1rem] leading-[1.5] text-[#2c4a7c] dark:text-[#5e8be6] border-l-4 border-[#2c4a7c] dark:border-[#5e8be6] pl-4 italic">
            "Every pattern is a bet. Every bet is a theory.
            Every theory can be wrong."
          </p>
        </div>

        <div className="mb-10 pb-8 border-b border-dashed border-muted hidden md:block">
          <div className="text-[0.8rem] leading-[2] font-['Special_Elite'] text-foreground">
            <div>ES — native</div>
            <div>EN — fluent</div>
            <div>DE — functional</div>
            <div>JS/TS — daily</div>
            <div>PY — when needed</div>
            <div>SOL — on-chain</div>
          </div>
        </div>

        <div>
          <div className="text-[0.75rem] leading-[1.8] text-muted-foreground">
            Find me where the work lives.<br />
            Not on LinkedIn.<br />
            <a href="mailto:ncerratoanton@gmail.com" className="text-destructive font-['Special_Elite'] no-underline text-[0.85rem] mt-1 inline-block hover:underline">ncerratoanton@gmail.com</a>
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="md:col-span-2 p-6 md:p-8 md:pr-12 md:border-r-2 md:border-t-2 border-foreground relative grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="relative pt-2">
          <div className="font-['Bebas_Neue'] text-[1.8rem] leading-none mb-2">HYPERQUANT</div>
          <p className="text-[0.8rem] leading-[1.6] text-foreground/80">
            A trading dashboard built for the way I actually think.
            Regime classification, margin visualization, execution flow.
            Not a product. A tool.
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="stamp -rotate-1">DERIVATIVES</span>
            <span className="stamp rotate-1 border-[#2c4a7c] dark:border-[#5e8be6] text-[#2c4a7c] dark:text-[#5e8be6]">REACT</span>
          </div>
        </div>

        <div className="pt-2">
          <div className="font-['Bebas_Neue'] text-[1.8rem] leading-none mb-2">MEMESCOPE</div>
          <p className="text-[0.8rem] leading-[1.6] text-foreground/80 mb-6">
            Autonomous terminal for tracking memetic narratives
            and token flows. Because information is the real asset.
            Alpha doesn't sleep.
          </p>

          <div className="mt-8">
            <div className="font-['Bebas_Neue'] text-[1.4rem] leading-none mb-1">TALENTSWAP</div>
            <p className="text-[0.8rem] leading-[1.6] text-foreground/80">
              Anti-institutional talent platform.
              Open competition, no gatekeepers.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
