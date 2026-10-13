import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import type { PortfolioData } from "../types";
import { MaskText } from "./ui";

// Devicon logos drawn in black, which disappear on the dark theme
const DARK_ICONS = new Set(["express", "github", "next.js", "vercel"]);

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Endless row that drifts on its own and speeds up / reverses with scroll velocity. */
function VelocityRow({ children, baseVelocity }: { children: ReactNode; baseVelocity: number }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    const move = direction.current * baseVelocity * (delta / 1000) * (1 + Math.abs(f));
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="marquee">
      <motion.div className="marquee-track" style={{ x }}>
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default function Skills({ data }: { data: PortfolioData }) {
  const skills = data.skills.filter(
    (s, i, all) => all.findIndex((o) => o.name.toLowerCase() === s.name.toLowerCase()) === i,
  );
  const half = Math.ceil(skills.length / 2);

  const pills = (list: typeof skills) =>
    list.map((s) => (
      <span key={s.name} className="skill-pill">
        <img
          src={s.image}
          alt=""
          loading="lazy"
          className={DARK_ICONS.has(s.name.toLowerCase()) ? "is-dark" : undefined}
        />
        {s.name}
      </span>
    ));

  return (
    <section id="skills" className="section skills">
      <div className="container skills-head">
        <span className="eyebrow">Toolbox</span>
        <h2 className="section-title">
          <MaskText lines={[<>Tech I use to</>, <span className="serif accent">bring ideas to life</span>]} />
        </h2>
      </div>
      <VelocityRow baseVelocity={-2}>{pills(skills.slice(0, half))}</VelocityRow>
      <VelocityRow baseVelocity={2}>{pills(skills.slice(half))}</VelocityRow>
    </section>
  );
}
