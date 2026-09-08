"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const TAGLINE = "Let's build something.";

const LINKS = [
  {
    label: "skeval1601@gmail.com",
    href: "mailto:skeval1601@gmail.com",
    kind: "email" as const,
  },
  {
    label: "linkedin.com/in/keval-savaliya",
    href: "https://linkedin.com/in/keval-savaliya",
    kind: "linkedin" as const,
  },
  {
    label: "github.com/SKeval",
    href: "https://github.com/SKeval",
    kind: "github" as const,
  },
];

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.71 5.4-5.29 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
    </svg>
  );
}

function Typewriter({ start }: { start: boolean }) {
  const [count, setCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (shouldReduceMotion) {
      setCount(TAGLINE.length);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= TAGLINE.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [start, shouldReduceMotion]);

  const done = count >= TAGLINE.length;

  return (
    <span>
      {TAGLINE.slice(0, count)}
      <span
        aria-hidden
        className={`ml-0.5 inline-block w-[2px] bg-accent align-middle ${
          done ? "opacity-0" : "animate-pulse opacity-100"
        }`}
        style={{ height: "0.9em" }}
      />
    </span>
  );
}

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function linkVariants(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay, ease: "easeOut" },
    },
  };
}

const LINK_BASE_DELAY = 1.3;
const LINK_STAGGER = 0.2;

export default function Contact() {
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
      id="contact"
      ref={sectionRef}
      className="section-transparent relative z-[1] w-full py-[120px]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative z-0 mb-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-10 z-[-1] select-none font-display text-[160px] font-extrabold leading-none text-accent"
            style={{ opacity: "var(--number-opacity)" }}
          >
            05
          </span>
          <motion.h2
            initial={initial}
            animate={controls}
            variants={headingVariants}
            className="relative font-display text-4xl font-bold text-foreground sm:text-5xl"
          >
            Contact
          </motion.h2>
        </div>

        <p className="font-display text-2xl text-foreground sm:text-3xl">
          <Typewriter start={inView} />
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          {LINKS.map((link, i) => {
            const delay = LINK_BASE_DELAY + i * LINK_STAGGER;

            if (link.kind === "email") {
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={initial}
                  animate={controls}
                  variants={linkVariants(delay)}
                  className="motion-glitch inline-block text-sm text-accent/80 transition-colors duration-150 hover:text-accent"
                >
                  {link.label}
                </motion.a>
              );
            }

            const Icon = link.kind === "linkedin" ? LinkedInIcon : GitHubIcon;

            return (
              <motion.a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={initial}
                animate={controls}
                variants={linkVariants(delay)}
                className="group inline-flex items-center gap-2 text-sm text-accent/80 transition-colors duration-150 hover:text-accent"
              >
                <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[10deg]" />
                {link.label}
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
