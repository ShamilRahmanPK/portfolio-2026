import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import type { PortfolioData } from "../types";
import { ease } from "./ui";

export default function Hero({ data }: { data: PortfolioData }) {
  const { hero } = data;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // Parallax layers: each moves at its own speed as the hero scrolls away
  const line1X = useTransform(p, [0, 1], ["0%", "-18%"]);
  const line2X = useTransform(p, [0, 1], ["0%", "14%"]);
  const photoY = useTransform(p, [0, 1], ["0%", "-40%"]);
  const photoRotate = useTransform(p, [0, 1], [-4, 6]);
  const orb1Y = useTransform(p, [0, 1], ["0%", "60%"]);
  const orb2Y = useTransform(p, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(p, [0, 0.7], [1, 0]);
  const shrink = useTransform(p, [0, 1], [1, 0.92]);

  const [first, ...rest] = hero.name.split(" ");
  const roles = hero.tagline.split("|").map((s) => s.trim()).filter(Boolean);
  const intro = data.about.split(". ")[0] + ".";

  return (
    <section ref={ref} id="top" className="hero">
      <div className="hero-bg" aria-hidden>
        <motion.div className="orb orb-1" style={{ y: orb1Y }} />
        <motion.div className="orb orb-2" style={{ y: orb2Y }} />
      </div>

      <motion.div className="container hero-inner" style={{ opacity: fade, scale: shrink }}>
        <motion.div
          className="hero-top"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          <span className="status">
            <span className="status-dot" />
            Available for new projects
          </span>
          <span className="muted hero-roles">
            {roles.join(" · ")}
            {hero.location && (
              <>
                <span className="hero-sep" /> <MapPin size={14} /> {hero.location}
              </>
            )}
          </span>
        </motion.div>

        <h1 className="hero-name">
          <motion.span className="hero-line" style={{ x: line1X }}>
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease }}
            >
              {first}
            </motion.span>
          </motion.span>
          <motion.span className="hero-line hero-line-2" style={{ x: line2X }}>
            <motion.span
              className="hero-photo"
              style={{ y: photoY, rotate: photoRotate }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease }}
            >
              <img src={hero.avatarCutout ?? hero.avatar} alt={hero.name} />
            </motion.span>
            <motion.span
              className="serif"
              style={{ display: "inline-block" }}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.28, ease }}
            >
              {rest.join(" ")}
            </motion.span>
          </motion.span>
        </h1>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
        >
          <p className="hero-intro">{intro}</p>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">
              See my work
              <span className="btn-icon">
                <ArrowUpRight size={16} />
              </span>
            </a>
            <a href={hero.resumeUrl} download className="btn btn-outline">
              Resume
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.a href="#about" className="scroll-hint" style={{ opacity: fade }} aria-label="Scroll down">
        <ArrowDown size={16} />
      </motion.a>
    </section>
  );
}
