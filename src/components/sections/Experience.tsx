"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

type Entry = {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
};

const ENTRIES: Entry[] = [
  {
    company: "MAHLE International GmbH",
    role: "IT Innovation & Digitalization Intern",
    period: "Sept 2026 - Present",
    location: "Stuttgart, Germany",
    description:
      "Applying RAG pipelines and LLM integration to enterprise-scale digitalization challenges in the automotive sector.",
  },
  {
    company: "Soccerkinetics",
    role: "AI Automation Engineer",
    period: "Aug 2026 - Present",
    location: "Stuttgart, Germany (Remote)",
    description:
      "Built automated computer vision and local LLM inference pipelines for content analysis and classification.",
  },
  {
    company: "Mindioo",
    role: "AI Engineer Intern",
    period: "Apr 2026 - Aug 2026",
    location: "Prague, Czech Republic (Remote)",
    description:
      "Production NCF recommendation pipeline on AWS EC2 with Docker and RabbitMQ. RAG QA agent with LangChain, ChromaDB, and TinyLlama.",
  },
  {
    company: "Data Glacier",
    role: "Data Scientist Intern",
    period: "Jul 2025 - Sep 2025",
    location: "Remote",
    description:
      "Python automation and KPI dashboards reducing manual reporting time by 60%. ML model accuracy improved 15% via feature engineering.",
  },
  {
    company: "HackSec Infotech",
    role: "Data Scientist Intern",
    period: "Jun 2023 - Jan 2024",
    location: "India",
    description:
      "CI/CD pipeline deployment with Jenkins, Docker, Kubernetes. Large-scale data analysis with Python and SQL.",
  },
];

const ENTRY_BASE_DELAY = 0.4;
const ENTRY_STAGGER = 0.2;

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const lineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1, delay: 0.2, ease: "easeInOut" },
  },
};

function rowVariants(delay: number, isRight: boolean): Variants {
  return {
    hidden: { opacity: 0, x: isRight ? 40 : -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay, ease: "easeOut" },
    },
  };
}

function cardVariants(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: delay + 0.15, ease: "easeOut" },
    },
  };
}

function dotVariants(delay: number): Variants {
  return {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: [0, 1.8, 1],
      transition: { duration: 0.5, delay, ease: "easeOut" },
    },
  };
}

export default function Experience() {
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
      id="experience"
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
            02
          </span>
          <motion.h2
            initial={initial}
            animate={controls}
            variants={headingVariants}
            className="relative font-display text-4xl font-bold text-foreground sm:text-5xl"
          >
            Experience
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
            Where I have worked.
          </motion.p>
        </div>

        <div className="relative">
          <motion.div
            initial={initial}
            animate={controls}
            variants={lineVariants}
            style={{ transformOrigin: "top" }}
            className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2"
          />

          <div className="space-y-12">
            {ENTRIES.map((entry, i) => {
              const isRight = i % 2 === 0;
              const delay = ENTRY_BASE_DELAY + i * ENTRY_STAGGER;
              return (
                <motion.div
                  key={entry.company}
                  initial={initial}
                  animate={controls}
                  variants={rowVariants(delay, isRight)}
                  className="relative md:grid md:grid-cols-2 md:gap-x-12"
                >
                  <motion.span
                    initial={initial}
                    animate={controls}
                    variants={dotVariants(delay)}
                    className="absolute left-4 top-6 h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-accent md:left-1/2"
                  />

                  <div
                    className={`pl-10 md:pl-0 ${
                      isRight
                        ? "md:col-start-2 md:pl-12"
                        : "md:col-start-1 md:pr-12"
                    }`}
                  >
                    <motion.div
                      initial={initial}
                      animate={controls}
                      variants={cardVariants(delay)}
                      className="rounded-[4px] border border-border bg-surface p-6 transition-colors hover:border-accent/40"
                    >
                      <p className="font-display text-lg font-bold text-foreground">
                        {entry.company}
                      </p>
                      <p className="mt-1 font-display text-sm text-accent">
                        {entry.role}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {entry.period}
                      </p>
                      <p className="text-xs text-muted">{entry.location}</p>
                      <p className="mt-4 text-sm text-foreground/70">
                        {entry.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
