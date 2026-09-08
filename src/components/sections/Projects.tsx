"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

type Project = {
  name: string;
  tag: string;
  stack: string[];
  description: string;
  links: { label: string; href: string }[];
};

const PROJECTS: Project[] = [
  {
    name: "AutoDoc Intelligence",
    tag: "Flagship",
    stack: [
      "LangGraph",
      "pgvector",
      "BGE-M3",
      "BM25",
      "Cohere Reranker",
      "Ragas",
      "DeepEval",
      "FastAPI",
      "Docker",
      "AWS",
    ],
    description:
      "Multi-agent RAG system over automotive technical documents. Hybrid dense and sparse retrieval improving context precision from 0.61 to 0.81. CI eval gate blocking PRs above 5% hallucination rate.",
    links: [{ label: "GitHub", href: "https://github.com/SKeval" }],
  },
  {
    name: "CreoBot",
    tag: "Live",
    stack: [
      "FastAPI",
      "Next.js 14",
      "Groq LLaMA 3.3 70B",
      "pgvector",
      "Supabase",
      "Stripe",
    ],
    description:
      "Production SaaS platform with Stripe billing, pgvector semantic search, and LLM content generation serving real users. Architected with FastAPI backend, Supabase auth, and Next.js 14 frontend deployed on Vercel with full CI/CD.",
    links: [
      { label: "Live", href: "https://creo-bot-tau.vercel.app/" },
      { label: "GitHub", href: "https://github.com/SKeval/CreoBot" },
    ],
  },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.71 5.4-5.29 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function cardVariants(fromLeft: boolean, delay: number): Variants {
  return {
    hidden: { opacity: 0, x: fromLeft ? -40 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay, ease: "easeOut" },
    },
  };
}

const bannerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.8, ease: "easeOut" },
  },
};

export default function Projects() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: true });
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      controls.set("visible");
    } else {
      controls.start("visible");
    }
  }, [inView, controls, shouldReduceMotion]);

  const initial = shouldReduceMotion ? "visible" : "hidden";

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-transparent relative z-[1] w-full py-[120px]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative z-0 mb-20">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-10 z-[-1] select-none font-display text-[160px] font-extrabold leading-none text-accent"
            style={{ opacity: "var(--number-opacity)" }}
          >
            03
          </span>
          <motion.h2
            initial={initial}
            animate={controls}
            variants={headingVariants}
            className="relative font-display text-4xl font-bold text-foreground sm:text-5xl"
          >
            Projects
          </motion.h2>
          <motion.p
            initial={initial}
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.1, ease: "easeOut" },
              },
            }}
            className="relative mt-3 font-display text-xl text-accent"
          >
            Things I have built and shipped.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              initial={initial}
              animate={controls}
              variants={cardVariants(i === 0, i === 0 ? 0.3 : 0.5)}
              className="rounded-[4px] border border-border bg-surface p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_0_20px_var(--accent-subtle)]"
            >
              <span
                className="inline-block rounded-[3px] border px-2 py-1 text-[11px] text-accent"
                style={{
                  backgroundColor: "var(--accent-subtle)",
                  borderColor: "var(--border-hover)",
                }}
              >
                {project.tag}
              </span>

              <h3 className="mt-4 font-display text-[22px] font-bold text-foreground">
                {project.name}
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border px-2.5 py-1 text-[10px] text-muted"
                    style={{
                      backgroundColor: "var(--bg-surface-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-[14px] leading-[1.6] text-foreground/65">
                {project.description}
              </p>

              <div className="mt-5 flex gap-5">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-accent hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.a
          href="https://github.com/SKeval"
          target="_blank"
          rel="noopener noreferrer"
          initial={initial}
          animate={controls}
          variants={bannerVariants}
          className="group mt-12 flex items-center justify-between rounded-[4px] border border-border bg-surface px-10 py-7 transition-colors hover:border-accent hover:bg-[var(--accent-subtle)]"
        >
          <div className="flex items-center gap-4">
            <GitHubIcon className="h-6 w-6 text-accent" />
            <span className="font-display text-lg text-foreground">
              Explore all projects on GitHub
            </span>
          </div>
          <ArrowRightIcon className="h-5 w-5 text-accent transition-transform duration-200 group-hover:translate-x-1" />
        </motion.a>
      </div>
    </section>
  );
}
