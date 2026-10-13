import { useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Layout, Server, Smartphone } from "lucide-react";
import type { PortfolioData } from "../types";
import { MaskText } from "./ui";

type Item = NonNullable<PortfolioData["expertise"]>[number];

const ICONS = { frontend: Layout, backend: Server, mobile: Smartphone };

// Each card drifts at its own speed, so the row staggers as you scroll
const OFFSETS = [60, -40, 100];

function ExpertiseCard({ item, index, progress }: { item: Item; index: number; progress: MotionValue<number> }) {
  // Stacked cards on narrow screens would overlap, so only stagger in the 3-column layout
  const [wide] = useState(() => window.matchMedia("(min-width: 961px)").matches);
  const y = useTransform(progress, [0, 1], [wide ? OFFSETS[index % OFFSETS.length] : 0, 0]);
  const Icon = ICONS[item.icon];

  return (
    <motion.article className={`card expertise-card ${item.icon === "backend" ? "is-featured" : ""}`} style={{ y }}>
      <div className="expertise-top">
        <div className="card-icon expertise-icon">
          <Icon size={22} />
        </div>
        <span className="muted expertise-index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="expertise-title">{item.title}</h3>
      <p className="muted expertise-desc">{item.description}</p>
      <div className="project-tags">
        {item.tools.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default function Expertise({ data }: { data: PortfolioData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });

  if (!data.expertise?.length) return null;

  return (
    <section id="expertise" className="section expertise">
      <div className="container">
        <span className="eyebrow">What I do</span>
        <h2 className="section-title">
          <MaskText lines={[<>Full stack,</>, <span className="serif accent">end to end</span>]} />
        </h2>
        <div ref={ref} className="expertise-grid">
          {data.expertise.map((item, i) => (
            <ExpertiseCard key={item.title} item={item} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
