import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TypewriterEffect } from "../components/ui/typewriter-effect";

const Home = () => {
  const phrases = [
    { prefix: "KNOWN AS A ", highlight: "TRADER" },
    { prefix: "KNOWN AS A ", highlight: "BUILDER" },
    { prefix: "KNOWN AS A ", highlight: "TRAVELLER" },
    { prefix: "KNOWN AS A ", highlight: "MUSICIAN" },
    { prefix: "KNOWN AS A ", highlight: "PROGRAMMER" },

    { prefix: "BUT IN TRUTH I AM ", highlight: "JUST A MAN" }
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % phrases.length);
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
            <TypewriterEffect text="Hola amigo" typingDelay={70} deletingDelay={30} cursor={true} cursorCharacter="_" />
          </h1>
          <div className="font-['Courier_Prime'] text-[0.85rem] md:text-[0.95rem] leading-[1.7] max-w-[520px] text-muted-foreground italic min-h-[1.5em]">
            <TypewriterEffect
              text={[
                "Sapere aude.",
                "Veritas vos liberabit.",
                "Invictus animus.",
                "Nosce te ipsum.",
                "Natura libera.",
                "Non est ad astra mollis e terris via.",
                "Vincit qui se vincit.",
                "Nemo liber est qui corpori servit.",
                "Animus liber est.",
                "Veritati obnoxius sum.",
                "In lumine tuo videbimus lumen."
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

        {/* <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] mb-6 text-foreground relative z-10 mt-8">
          I am a<br />
          <span className="text-destructive relative">reader</span> of<br />
          <span className="relative after:content-[''] after:absolute after:bottom-1 md:after:bottom-2 after:left-0 after:right-0 after:h-[2px] md:after:h-[3px] after:bg-foreground">hidden</span><br />
          order.
        </h2> */}

        <div className="text-[0.85rem] md:text-[0.95rem] leading-[1.7] max-w-[520px] text-foreground space-y-5 relative z-10">
          <p className="font-['Bebas_Neue'] text-2xl sm:text-3xl md:text-4xl text-foreground tracking-[0.1em]">ON THE STATE OF THINGS</p>
          <p>
            There's a kind of person who comes to understand, usually through some combination of insight, luck and suffering, that the game being played on the surface is not the actual game. That life as it is currently being presented is not an active state of living, but a slow erasure and annihilation of the humane; as it is replaced by the machine-like.
          </p>
          <div className="border-l-2 border-destructive pl-4 my-6 space-y-4 text-muted-foreground">
            <p>
              The old ideal of compounded human flourishing is largely a husk. We are left with the illusion of choice, where meaning is commodified and sold back to us on a subscription plan. We are told to hustle our way out, but the hustle is part of the same machine, repackaged as resistance.
            </p>
            <p>
              So how does one live? You cannot vote your way out. You cannot buy your way out.
              The only answer is to live with integrity, with agency, and with your eyes open to the nature of reality. To strip away ideology and question everything.
            </p>
          </div>
          <p>
            Treat life as a game you didn't design but have to play. Not with cynicism, but positive indifference. The rules are visible if you stop pretending they're natural. You learn to read the structure of what surrounds you — the market, the institution, the social system — and you find the degrees of freedom that the structure inadvertently permits.
          </p>
          <p>
            This site is a record of that attempt. The thinking, the work, the ongoing effort to be a real person in an era that finds that inconvenient.
          </p>
          <Link
            to="/writings/on-the-state-of-things"
            className="mt-10 block border-2 border-foreground hover:border-destructive transition-colors duration-300 relative group overflow-hidden no-underline"
          >
            {/* Background Hover Effect */}
            <div className="absolute inset-0 bg-transparent group-hover:bg-destructive/[0.03] transition-colors duration-500 pointer-events-none z-0"></div>

            {/* Decorative Side Element */}
            <div className="absolute right-0 top-0 bottom-0 w-10 md:w-16 border-l-2 border-foreground group-hover:border-destructive transition-colors duration-300 flex flex-col items-center justify-center bg-foreground group-hover:bg-destructive text-background pointer-events-none z-10 overflow-hidden">
              <span className="font-mono text-[0.7rem] md:text-[0.85rem] -rotate-90 tracking-[0.3em] uppercase whitespace-nowrap group-hover:scale-110 transition-transform duration-300">
                Read
              </span>
            </div>

            <div className="relative z-10 p-6 md:p-8 pr-16 md:pr-24 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-[2px] w-6 md:w-8 bg-destructive group-hover:w-12 transition-all duration-300"></span>
                <span className="font-['Special_Elite'] text-[0.75rem] uppercase tracking-widest text-destructive">
                  Core Ideology
                </span>
              </div>
              

              <h3 className="font-['Bebas_Neue'] text-3xl md:text-4xl lg:text-5xl tracking-[0.05em] text-foreground m-0 leading-[0.9] group-hover:text-destructive transition-colors duration-300">
                ON THE STATE OF THINGS
              </h3>

              <p className="font-['Courier_Prime'] text-[0.85rem] text-muted-foreground md:text-[0.95rem] max-w-[400px] mt-2 mb-0">
                The full essay exploring the erasure of the humane, the interfaced flesh, and the absolute necessity of reclaiming agency.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 pt-4 border-t border-dashed border-muted relative z-10">
          <div className="font-['Bebas_Neue'] text-2xl sm:text-3xl md:text-4xl text-foreground tracking-[0.1em] min-h-[2.4rem]">
            <div
              className={`transition-all duration-300 ${isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}
            >
              <span>{phrases[currentWordIndex].prefix}</span>
              <span className="text-destructive">
                {phrases[currentWordIndex].highlight}</span>
            </div>
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
            "Everything is a pattern asking to be resolved."
          </p>
        </div>

        <div className="mb-10 pb-8 border-b border-dashed border-muted hidden md:block">
          <div className="text-[0.8rem] leading-[2] font-['Special_Elite'] text-foreground">
            <div>ES — native</div>
            <div>EN — fluent</div>
            <div>DE — functional</div>

          </div>
        </div>

        <div>
          <div className="text-[0.75rem] leading-[1.8] text-muted-foreground">
            Find me where the work lives.<br />
            Not on LinkedIn.<br />
            <a href="mailto:kygra1@proton.com"
              rel="noopener noreferrer"
              className="text-destructive font-['Special_Elite'] no-underline text-[0.85rem] mt-1 inline-block hover:underline">kygra1@proton.com</a>
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
          </p>
          {/* <div className="mt-4 flex gap-2 flex-wrap">
            <span className="stamp -rotate-1">DERIVATIVES</span>
            <span className="stamp rotate-1 border-[#2c4a7c] dark:border-[#5e8be6] text-[#2c4a7c] dark:text-[#5e8be6]">REACT</span>
          </div> */}
        </div>

        <div className="pt-2">
          <div className="font-['Bebas_Neue'] text-[1.8rem] leading-none mb-2">MEMESCOPE</div>
          <p className="text-[0.8rem] leading-[1.6] text-foreground/80 mb-6">
            Autonomous terminal for tracking memetic narratives
            and token flows. Because information is the real asset.
            Alpha doesn't sleep.
          </p>

          <div className="mt-8">
            <div className="font-['Bebas_Neue'] text-[1.4rem] leading-none mb-1">AGORA</div>
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
