import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy, Phone } from "lucide-react";
import type { PortfolioData } from "../types";
import { GithubIcon, LinkedinIcon, MaskText } from "./ui";

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return <>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>;
}

export default function Contact({ data }: { data: PortfolioData }) {
  const { hero } = data;
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // The card grows to full width and its corners soften as it scrolls in.
  // Phones get a subtler version: an 80px radius on a 360px card looks like a pill.
  const [narrow] = useState(() => window.matchMedia("(max-width: 640px)").matches);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const scale = useTransform(scrollYProgress, [0, 1], [narrow ? 0.96 : 0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], narrow ? [40, 24] : [80, 32]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hero.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${hero.email}`;
    }
  };

  return (
    <section id="contact" className="contact-section">
      <motion.div ref={ref} className="contact-card" style={{ scale, borderRadius: radius }}>
        <div className="container">
          <span className="eyebrow contact-eyebrow">Contact</span>
          <h2 className="contact-title">
            <MaskText
              lines={[
                <>Let&apos;s build</>,
                <>
                  something <span className="serif accent">great</span>
                </>,
                <>together.</>,
              ]}
            />
          </h2>

          <div className="contact-row">
            <div className="contact-links">
              <a href={`mailto:${hero.email}`} className="contact-email">
                {hero.email}
                <ArrowUpRight size={28} />
              </a>
              {hero.phone && (
                <a href={`tel:${hero.phone.replace(/\s+/g, "")}`} className="contact-phone">
                  <Phone size={18} /> {hero.phone}
                </a>
              )}
            </div>
            <button type="button" className="btn contact-copy" onClick={copy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy email"}
            </button>
          </div>

          <div className="contact-footer">
            <div className="contact-socials">
              <a href={hero.github} target="_blank" rel="noreferrer">
                <GithubIcon size={16} /> GitHub
              </a>
              <a href={hero.linkedin} target="_blank" rel="noreferrer">
                <LinkedinIcon size={16} /> LinkedIn
              </a>
              <a href={hero.resumeUrl} download>
                Resume
              </a>
            </div>
            <div className="contact-meta">
              <span>
                Local time <LocalTime />
              </span>
              <span>
                © {new Date().getFullYear()} {hero.name}
              </span>
              <a href="#top" className="to-top" aria-label="Back to top">
                <ArrowUp size={16} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
