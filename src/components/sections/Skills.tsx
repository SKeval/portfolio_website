"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

type SkillGroup = {
  name: string;
  skills: string[];
};

const SKILL_GROUPS: SkillGroup[] = [
  {
    name: "RAG & Retrieval",
    skills: [
      "Hybrid Search",
      "BM25",
      "pgvector",
      "ChromaDB",
      "Pinecone",
      "FAISS",
      "Cohere Reranker",
      "BGE-M3",
      "SentenceTransformers",
    ],
  },
  {
    name: "Agentic AI",
    skills: [
      "LangGraph",
      "LangChain Agents",
      "MCP Servers",
      "Multi-Agent Architectures",
      "Pydantic",
      "Tool Use",
    ],
  },
  {
    name: "LLMs & Eval",
    skills: [
      "Claude API",
      "OpenAI",
      "Gemini",
      "Groq",
      "Ragas",
      "DeepEval",
      "LangSmith",
      "Prompt Engineering",
    ],
  },
  {
    name: "Automation",
    skills: [
      "n8n Workflows",
      "Apify",
      "Apollo.io",
      "Airtable",
      "Lead Generation Pipelines",
    ],
  },
  {
    name: "Programming",
    skills: ["Python", "TypeScript", "SQL", "C/C++", "Java"],
  },
  {
    name: "ML & Data",
    skills: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "XGBoost",
      "Pandas",
      "NumPy",
      "BERT",
      "Transformers",
    ],
  },
  {
    name: "Cloud & Infra",
    skills: [
      "AWS EC2",
      "GCP",
      "RabbitMQ",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "Kubernetes",
    ],
  },
];

const CARD_BASE_DELAY = 0.3;
const CARD_STAGGER = 0.15;
const CARD_DURATION = 0.35;
const PILL_STAGGER = 0.05;

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function cardVariants(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: CARD_DURATION, delay, ease: "easeOut" },
    },
  };
}

function pillVariants(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, delay, ease: "easeOut" },
    },
  };
}

export default function Skills() {
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
      id="skills"
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
            04
          </span>
          <motion.h2
            initial={initial}
            animate={controls}
            variants={headingVariants}
            className="relative font-display text-4xl font-bold text-foreground sm:text-5xl"
          >
            Skills
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
            What I work with.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group, i) => {
            const cardDelay = CARD_BASE_DELAY + i * CARD_STAGGER;
            return (
              <motion.div
                key={group.name}
                initial={initial}
                animate={controls}
                variants={cardVariants(cardDelay)}
                className="group rounded-[4px] border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40"
              >
                <p className="font-display text-[13px] font-bold uppercase tracking-[1.5px] text-accent">
                  {group.name}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill, j) => (
                    <motion.span
                      key={skill}
                      initial={initial}
                      animate={controls}
                      variants={pillVariants(
                        cardDelay + CARD_DURATION + j * PILL_STAGGER
                      )}
                      className="rounded-[3px] border border-[var(--border)] bg-[var(--bg-surface-2)] px-[10px] py-[4px] text-[11px] text-foreground/75 transition-colors duration-150 group-hover:border-accent/30 group-hover:text-foreground/90 hover:border-[var(--border-hover)] hover:bg-[var(--accent-subtle)] hover:text-accent"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
