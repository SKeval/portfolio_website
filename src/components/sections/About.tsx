"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const STATS = [
  { value: "2+", label: "years building AI systems" },
  { value: "10+", label: "production projects shipped" },
];

function Counter({ value, start }: { value: string; start: boolean }) {
  const target = parseInt(value, 10);
  const suffix = value.replace(/[0-9]/g, "");
  const [display, setDisplay] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (shouldReduceMotion) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, target, shouldReduceMotion]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

const fadeUp = (delay: number, duration = 0.5): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration, delay, ease: "easeOut" } },
});

const fadeIn = (delay: number, duration = 0.4): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration, delay } },
});

const wipeIn = (delay: number, duration = 0.4): Variants => ({
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration, delay, ease: "easeInOut" },
  },
});

export default function About() {
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
      id="about"
      ref={sectionRef}
      className="section-transparent relative z-[1] w-full py-[120px]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative z-0 mb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-10 z-[-1]"
            style={{ opacity: "var(--number-opacity)" }}
          >
            <motion.span
              initial={initial}
              animate={controls}
              variants={fadeIn(0.3, 0.5)}
              className="block select-none font-display text-[160px] font-extrabold leading-none text-accent"
            >
              01
            </motion.span>
          </div>
          <motion.h2
            initial={initial}
            animate={controls}
            variants={wipeIn(0.4)}
            className="relative font-display text-4xl font-bold text-foreground sm:text-5xl"
          >
            About
          </motion.h2>
          <motion.p
            initial={initial}
            animate={controls}
            variants={fadeUp(0.6)}
            className="relative mt-3 font-display text-xl text-accent"
          >
            Builder. Not a researcher.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[160px_1fr] md:gap-16">
          <div className="relative hidden h-full md:block">
            <div className="absolute left-6 top-0 h-full w-px bg-accent" />
          </div>

          <div>
            <div className="max-w-2xl space-y-5 text-base leading-relaxed text-foreground sm:text-lg">
              <motion.p
                initial={initial}
                animate={controls}
                variants={fadeUp(0.8)}
              >
                I am an AI Systems Engineer based in Stuttgart, Germany. I do
                not theorise about intelligent systems. I build and ship
                them. RAG pipelines, multi-agent architectures, LLM
                automation workflows: production-grade, not demos.
              </motion.p>
              <motion.p
                initial={initial}
                animate={controls}
                variants={fadeUp(1.0)}
              >
                Every role I take is a data point. I collect skills,
                credibility, and capital with one end state in mind:
                ownership. Building something mine, on my own terms.
              </motion.p>
              <motion.p
                initial={initial}
                animate={controls}
                variants={fadeUp(1.2)}
              >
                MSc student in Automotive Software Engineering at TU
                Chemnitz. Currently at MAHLE International GmbH (Stuttgart)
                applying AI to enterprise-scale problems.
              </motion.p>
            </div>

            <div className="mt-14 grid max-w-xl grid-cols-2 gap-8">
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={initial}
                  animate={controls}
                  variants={fadeUp(1.4)}
                >
                  <p className="font-display text-3xl font-bold text-accent sm:text-4xl">
                    <Counter value={stat.value} start={inView} />
                  </p>
                  <p className="mt-2 text-sm text-muted">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
