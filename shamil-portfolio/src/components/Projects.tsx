import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Lock, Smartphone } from "lucide-react";
import type { PortfolioData } from "../types";
import { MaskText, Reveal } from "./ui";

type Project = PortfolioData["projects"][number];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** Stand-in artwork for private client work that has no public screenshot. */
const BARS = [40, 65, 50, 80, 60, 92, 74];

function PrivatePreview({ kind = "dashboard" }: { kind?: Project["preview"] }) {
  if (kind === "mobile") {
    return (
      <div className="private-preview" aria-hidden>
        <div className="private-phone">
          <div className="private-notch" />
          <div className="private-card-accent">
            <i />
            <b />
          </div>
          {[0, 1, 2].map((r) => (
            <div key={r} className="private-row">
              <span className="private-avatar" />
              <div>
                <i />
                <i />
              </div>
            </div>
          ))}
          <div className="private-tabbar">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (kind === "tasks") {
    return (
      <div className="private-preview" aria-hidden>
        <div className="private-window">
          <div className="private-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="private-tasks">
            {[true, true, false, false].map((done, i) => (
              <div key={i} className={`private-task ${done ? "is-done" : ""}`}>
                <span className="private-check" />
                <i style={{ width: `${70 - i * 10}%` }} />
                <span className="private-pill" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="private-preview" aria-hidden>
      <div className="private-window">
        <div className="private-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="private-body">
          <div className="private-side">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="private-main">
            <div className="private-stats">
              <i />
              <i />
              <i />
            </div>
            <div className="private-chart">
              {BARS.map((h, i) => (
                <b key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, total, imageX }: { project: Project; index: number; total: number; imageX?: MotionValue<string> }) {
  const ref = useRef<HTMLDivElement>(null);
  // In the vertical layout each image drifts against its own scroll position
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const content = (
    <>
      <div ref={ref} className="project-media">
        {project.image ? (
          <motion.img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            style={imageX ? { x: imageX } : { y: imageY }}
          />
        ) : (
          <PrivatePreview kind={project.preview} />
        )}
        {project.badge && (
          <span className="project-badge">
            {project.badgeIcon === "app" ? <Smartphone size={12} /> : <Lock size={12} />} {project.badge}
          </span>
        )}
        {project.link && (
          <span className="project-arrow" aria-hidden>
            <ArrowUpRight size={20} />
          </span>
        )}
      </div>
      <div className="project-info">
        <div className="project-row">
          <h3 className="project-title">{project.title}</h3>
          <span className="muted project-count">
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
        </div>
        <p className="muted project-desc">{project.description}</p>
        <div className="project-tags">
          {project.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  return project.link ? (
    <a href={project.link} target="_blank" rel="noreferrer" className="project-card">
      {content}
    </a>
  ) : (
    <article className="project-card">{content}</article>
  );
}

function Heading() {
  return (
    <div className="projects-heading">
      <span className="eyebrow">Selected work</span>
      <h2 className="section-title">
        <MaskText lines={[<>Things I&apos;ve</>, <span className="serif accent">designed & built</span>]} />
      </h2>
    </div>
  );
}

/** Desktop: the section pins and the cards slide sideways as you scroll down. */
function HorizontalProjects({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  // Image is 130% of the card width, so shifting it up to 18% never exposes an edge
  const imageX = useTransform(smooth, [0, 1], ["0%", "-18%"]);

  return (
    <section ref={sectionRef} id="projects" className="projects-pinned" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="projects-sticky">
        <motion.div ref={trackRef} className="projects-track" style={{ x }}>
          <Heading />
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} total={projects.length} imageX={imageX} />
          ))}
        </motion.div>
        <div className="container projects-progress">
          <motion.span style={{ scaleX: smooth }} />
        </div>
      </div>
    </section>
  );
}

function VerticalProjects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <Heading />
        <div className="projects-grid">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.08}>
              <ProjectCard project={p} index={i} total={projects.length} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Projects({ data }: { data: PortfolioData }) {
  const horizontal = useMediaQuery("(min-width: 960px) and (min-height: 700px)");
  const shown = data.projects.filter((p) => !p.hidden);
  return horizontal ? <HorizontalProjects projects={shown} /> : <VerticalProjects projects={shown} />;
}
