"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";

export type SectionName =
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

type ScrollContextValue = {
  progressRef: MutableRefObject<number>;
  sectionRef: MutableRefObject<SectionName>;
  registerSection: (name: SectionName, el: HTMLElement | null) => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const progressRef = useRef(0);
  const sectionRef = useRef<SectionName>("hero");
  const sectionsMap = useRef(new Map<SectionName, HTMLElement>());

  const registerSection = useCallback(
    (name: SectionName, el: HTMLElement | null) => {
      if (el) {
        sectionsMap.current.set(name, el);
      } else {
        sectionsMap.current.delete(name);
      }
    },
    []
  );

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      rafId = null;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current =
        maxScroll > 0
          ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
          : 0;

      const referenceY = window.innerHeight * 0.4;
      let current = sectionRef.current;
      const names = [...sectionsMap.current.keys()];

      if (names.length > 0) {
        if (maxScroll <= 0 || window.scrollY >= maxScroll - 1) {
          // At (or past) the bottom of the page: always the last section,
          // regardless of whether it is tall enough to cross the reference line.
          current = names[names.length - 1];
        } else if (window.scrollY <= 0) {
          current = names[0];
        } else {
          sectionsMap.current.forEach((el, name) => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= referenceY && rect.bottom >= referenceY) {
              current = name;
            }
          });
        }
      }

      sectionRef.current = current;
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const value = useMemo(
    () => ({ progressRef, sectionRef, registerSection }),
    [registerSection]
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return ctx;
}
