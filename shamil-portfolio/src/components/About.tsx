import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { PortfolioData } from "../types";
import { Reveal } from "./ui";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="about-word">
      {word}{" "}
    </motion.span>
  );
}

/** Paragraph that lights up word by word as it scrolls through the viewport. */
function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className="about-text" aria-label={text}>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </span>
    </p>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function About({ data }: { data: PortfolioData }) {
  const startYear = Math.min(
    ...data.experience.flatMap((e) => (e.period.match(/\d{4}/g) ?? []).map(Number)),
  );
  const stats = [
    { value: data.projects.length, suffix: "", label: "Projects shipped" },
    {
      value: new Set(data.skills.map((s) => s.name.toLowerCase())).size,
      suffix: "+",
      label: "Technologies",
    },
    { value: Math.max(1, new Date().getFullYear() - startYear), suffix: "+", label: "Years building" },
  ];

  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <Reveal>
          <span className="eyebrow">About me</span>
        </Reveal>
        <div>
          <ScrollText text={data.about} />
          <div className="stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="stat">
                  <div className="stat-value">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="muted">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          {data.languages && (
            <Reveal>
              <div className="about-languages">
                <span className="muted">Languages</span>
                {data.languages.map((l) => (
                  <span key={l} className="chip">
                    {l}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
