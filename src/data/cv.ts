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
    org: "Punjab Engineering College (Deemed to be University)",
    location: "Chandigarh, India",
    period: "2026 - ...",
    details: ["Advisor: Prof. Advisor Name", "Thesis topic: Efficient and trustworthy learning systems"],
  },
  {
    title: "M.Sc. in Computer Science",
    org: "Kurukshetra University",
    location: "Kurukshetra, India",
    period: "2023 - 2025",
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
  { title: "Junior Research Fellowship UGC NET-JRF", year: "2025" },
  { title: "Outstanding Undergraduate Researcher Award", year: "2023" },
];

export const service: string[] = [
  "Reviewer: NeurIPS (2025, 2026), ICML (2026), ICLR (2026)",
  "Organizer, CS Graduate Student Seminar Series (2024 – Present)",
];

export const skills: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "C++", "C"] },
  { label: "Frameworks", items: ["PyTorch", "JAX", "CUDA"] },
  { label: "Tools", items: ["Git", "LaTeX"] },
];
