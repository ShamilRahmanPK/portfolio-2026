import { ArrowUpRight, Award, BookOpen, GraduationCap } from "lucide-react";
import type { PortfolioData } from "../types";
import { MaskText, Reveal } from "./ui";

export default function Credentials({ data }: { data: PortfolioData }) {
  return (
    <section id="credentials" className="section">
      <div className="container">
        <span className="eyebrow">Credentials</span>
        <h2 className="section-title">
          <MaskText lines={[<>Learning, </>, <span className="serif">always.</span>]} />
        </h2>

        <div className="bento">
          <Reveal className="bento-edu">
            <div className="card">
              <div className="card-icon">
                <GraduationCap size={20} />
              </div>
              <h3 className="card-title">Education</h3>
              <ul className="timeline-list">
                {data.education.map((e) => (
                  <li key={e.degree}>
                    <div>
                      <div className="item-title">{e.degree}</div>
                      <div className="muted">{e.institution}</div>
                    </div>
                    <span className="chip">{e.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="bento-courses" delay={0.08}>
            <div className="card">
              <div className="card-icon">
                <BookOpen size={20} />
              </div>
              <h3 className="card-title">Courses</h3>
              <ul className="timeline-list">
                {data.courses.map((c) => (
                  <li key={c.name}>
                    <div>
                      <div className="item-title">{c.name}</div>
                      <div className="muted">{c.provider}</div>
                      {c.note && <div className="item-note">{c.note}</div>}
                    </div>
                    <span className="chip">{c.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="bento-certs">
            {data.certificates.map((c, i) => (
              <Reveal key={c.id} delay={0.16 + i * 0.08} className="cert-wrap">
                <a href={c.link} target="_blank" rel="noreferrer" className="card cert-card">
                  <div className="cert-top">
                    <div className="card-icon accent-icon">
                      <Award size={20} />
                    </div>
                    <span className="cert-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: 14 }}>
                      Certificate · {c.year}
                    </div>
                    <h3 className="card-title" style={{ marginTop: 6 }}>
                      {c.name}
                    </h3>
                    <div className="muted">{c.issuer}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
