export interface PortfolioData {
  hero: {
    name: string;
    tagline: string;
    location?: string;
    github: string;
    linkedin: string;
    email: string;
    phone?: string;
    resumeUrl: string;
    avatar: string;
    /** Background-removed portrait used in the hero badge */
    avatarCutout?: string;
  };
  about: string;
  languages?: string[];
  expertise?: {
    title: string;
    icon: "frontend" | "backend" | "mobile";
    description: string;
    tools: string[];
  }[];
  skills: { name: string; image: string }[];
  experience: {
    role: string;
    company: string;
    location?: string;
    period: string;
    description: string;
    highlights?: string[];
  }[];
  education: { degree: string; institution: string; year: string }[];
  courses: { name: string; provider: string; year: string; note?: string }[];
  projects: {
    id: string;
    title: string;
    description: string;
    /** Private client work has no screenshot or public link */
    image?: string;
    link?: string;
    /** Counted in "Projects shipped" but not shown in the Work section */
    hidden?: boolean;
    badge?: string;
    /** Icon in the badge: a lock (default) or a phone for app-store listings */
    badgeIcon?: "lock" | "app";
    /** Artwork shown when there is no screenshot */
    preview?: "dashboard" | "mobile" | "tasks";
    tags: string[];
  }[];
  certificates: { id: string; name: string; issuer: string; year: string; link: string }[];
}
