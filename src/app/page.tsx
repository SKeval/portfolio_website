"use client";

import type { ReactNode } from "react";
import GlobalScene from "@/components/three/GlobalScene";
import ThemeToggle from "@/components/ThemeToggle";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import { useScroll, type SectionName } from "@/context/ScrollContext";
import { useTheme } from "@/context/ThemeContext";

function SectionWrapper({
  name,
  children,
}: {
  name: SectionName;
  children: ReactNode;
}) {
  const { registerSection } = useScroll();

  return (
    <div
      data-section={name}
      ref={(el) => registerSection(name, el)}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { theme } = useTheme();

  return (
    <>
      <GlobalScene theme={theme} />
      <ThemeToggle />
      <SectionWrapper name="hero">
        <Hero />
      </SectionWrapper>
      <SectionWrapper name="about">
        <About />
      </SectionWrapper>
      <SectionWrapper name="experience">
        <Experience />
      </SectionWrapper>
      <SectionWrapper name="projects">
        <Projects />
      </SectionWrapper>
      <SectionWrapper name="skills">
        <Skills />
      </SectionWrapper>
      <SectionWrapper name="contact">
        <Contact />
      </SectionWrapper>
    </>
  );
}
