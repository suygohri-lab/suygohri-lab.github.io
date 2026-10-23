/**
 * Structured CV data rendered on the /cv page.
 * Place a PDF at `public/cv.pdf` to enable the "Download PDF" button.
 */
export interface CvEntry {
  title: string;
  org: string;
  url?: string;
  location?: string;
  period: string;
  details?: string[];
}

export const education: CvEntry[] = [
  {
    title: "Ph.D. in Computer Science",
    org: "Your University",
    location: "City, Country",
    period: "2023 – Present",
    details: ["Advisor: Prof. Advisor Name", "Thesis topic: Efficient and trustworthy learning systems"],
  },
  {
    title: "B.S. in Computer Science",
    org: "Your Undergraduate University",
    location: "City, Country",
    period: "2019 – 2023",
    details: ["Graduated with highest honors"],
  },
];

export const experience: CvEntry[] = [
  {
    title: "Research Intern",
    org: "Example Research Lab",
    location: "City, Country",
    period: "Summer 2026",
    details: ["Designed sparse attention kernels that reduced inference latency by 2.1×."],
  },
  {
    title: "Graduate Research Assistant",
    org: "Your Research Lab, Your University",
    period: "2023 – Present",
    details: ["Leading projects on efficient model training and program synthesis."],
  },
];

export const teaching: CvEntry[] = [
  { title: "Teaching Assistant, CS 101: Introduction to Programming", org: "Your University", period: "Fall 2024" },
  { title: "Teaching Assistant, CS 485: Machine Learning", org: "Your University", period: "Spring 2025" },
];

export const awards: { title: string; year: string }[] = [
  { title: "Graduate Research Fellowship", year: "2024" },
  { title: "Outstanding Undergraduate Researcher Award", year: "2023" },
];

export const service: string[] = [
  "Reviewer: NeurIPS (2025, 2026), ICML (2026), ICLR (2026)",
  "Organizer, CS Graduate Student Seminar Series (2024 – Present)",
];

export const skills: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "C++", "Rust", "TypeScript"] },
  { label: "Frameworks", items: ["PyTorch", "JAX", "CUDA", "Triton"] },
  { label: "Tools", items: ["Git", "Docker", "Slurm", "LaTeX"] },
];
