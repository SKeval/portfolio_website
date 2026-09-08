"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="section-transparent relative z-[1] flex min-h-screen w-full items-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 75% 50%, var(--accent-subtle) 0%, transparent 60%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 0% 50%, var(--accent-subtle) 0%, transparent 60%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-background via-background/70 to-transparent sm:via-background/40"
      />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            KEVAL SAVALIYA
          </h1>
          <p className="mt-4 font-display text-xl font-normal not-italic text-accent sm:text-2xl">
            AI Systems Engineer
          </p>
          <p className="mt-6 whitespace-normal text-lg font-light text-foreground/85 sm:whitespace-nowrap sm:text-xl md:text-2xl">
            I build systems that think.
          </p>

          <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="rounded-[4px] bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[4px] border-[1.5px] border-accent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
            >
              Resume
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
