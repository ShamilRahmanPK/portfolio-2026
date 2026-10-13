import type { PortfolioData } from "../types";
import { MaskText, Reveal } from "./ui";

export default function Experience({ data }: { data: PortfolioData }) {
  return (
    <section id="experience" className="section">
      <div className="container exp-grid">
        <div className="exp-side">
          <span className="eyebrow">Experience</span>
          <h2 className="section-title">
            <MaskText lines={[<>Where I&apos;ve</>, <span className="serif">been working</span>]} />
          </h2>
          <p className="muted" style={{ marginTop: 24, maxWidth: 340 }}>
            From fintech CRMs to e-commerce and mobile apps — where I&apos;ve been shipping across the UAE and India.
          </p>
        </div>

        <ol className="exp-list">
          {data.experience.map((e, i) => (
            <Reveal key={`${e.company}-${e.period}`} delay={i * 0.06}>
              <li className="exp-item">
                <div className="exp-head">
                  <span className="exp-index">{String(i + 1).padStart(2, "0")}</span>
                  <div className="exp-title">
                    <h3 className="exp-role">{e.role}</h3>
                    <div className="exp-company">
                      {e.company}
                      {e.location && <span className="exp-location">{e.location}</span>}
                    </div>
                  </div>
                  <span className={`chip ${i === 0 ? "chip-active" : ""}`}>{e.period}</span>
                </div>
                <p className="muted exp-desc">{e.description}</p>
                {e.highlights && (
                  <ul className="exp-highlights">
                    {e.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
