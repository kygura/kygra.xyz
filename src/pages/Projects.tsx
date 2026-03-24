import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    title: "zkNull",
    description:
      "zkNull is a privacy coin with a dedicated privacy layer built on top of the zkEVM.",
    techStack: ["Solidity", "zkSNARKs", "Circom", "Foundry"],
    githubUrl: "https://github.com/kygura/zknull",
    liveUrl: "https://zknull.xyz",
  },
  {
    title: "Equilibria",
    description:
      "An algorithmic flatcoin with a built-in tranching system pegged to supply market dynamics.",
    techStack: ["Solidity", "NextJS", "Hardhat"],
    githubUrl: "https://github.com/kygura/equilibria-protocol",
    liveUrl: "https://equilibria.cash",
  },
  {
    title: "Meridian",
    description:
      "A cartographing interface to explore and mark meaningful experiences across the globe.",
    techStack: ["Google Maps", "Deepseek", "Claude", "React"],
    githubUrl: "https://github.com/kygura/meridian",
    liveUrl: "https://meridian-flame.vercel.app/",
  },
  /*   {
      title: "Nyx",
      description:
        "A decentralised social media app with a closed economy and a built-in prediction market.",
      techStack: [],
      githubUrl: "https://github.com/kygura/nyx",
      liveUrl: "https://nyx.xyz",
    }, */
];

const Projects = () => {
  return (
    <div className="px-6 md:px-12 lg:px-16 py-16 max-w-[1000px] mx-auto animate-fade-in font-['Courier_Prime']">
      <div className="mb-16 pb-8 border-b-[4px] border-foreground relative">
        <h1 className="text-5xl md:text-7xl font-['Bebas_Neue'] text-foreground tracking-widest uppercase mb-4 relative z-10">Software Projects</h1>
        <p className="text-lg md:text-xl text-foreground max-w-2xl leading-relaxed relative z-10">
          A selection of projects I'm currently building.
        </p>
      </div>

      <div className="space-y-16">
        {projects.map((project, index) => (
          <article
            key={index}
            className="relative group border-b-2 border-dashed border-muted pb-12 last:border-0"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <header className="mb-4">
              <h2 className="text-3xl md:text-5xl font-['Bebas_Neue'] uppercase tracking-wide text-foreground group-hover:text-destructive transition-colors leading-[0.9] mb-4">
                {project.title}
              </h2>

              <p className="text-[0.95rem] text-foreground leading-[1.7] max-w-3xl mb-6">
                {project.description}
              </p>
            </header>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-foreground/30 px-2 py-0.5 text-[0.65rem] tracking-[0.1em] uppercase text-foreground font-bold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-6 mt-6 pt-4 text-[0.7rem] text-muted-foreground uppercase tracking-widest font-bold">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors duration-300"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Projects;
