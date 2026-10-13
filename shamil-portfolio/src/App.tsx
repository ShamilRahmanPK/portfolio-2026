import { useEffect } from "react";
import Lenis from "lenis";
import portfolio from "./data/portfolio.json";
import type { PortfolioData } from "./types";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Expertise from "./components/Expertise";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Credentials from "./components/Credentials";
import Contact from "./components/Contact";
import "./App.css";

const data = portfolio as PortfolioData;

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -20 } });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

export default function App() {
  useSmoothScroll();
  const initials = data.hero.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <>
      <Nav initials={initials} />
      <main>
        <Hero data={data} />
        <About data={data} />
        <Expertise data={data} />
        <Skills data={data} />
        <Experience data={data} />
        <Projects data={data} />
        <Credentials data={data} />
        <Contact data={data} />
      </main>
    </>
  );
}
