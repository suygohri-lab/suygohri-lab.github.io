/**
 * Structured CV data rendered on the /cv page.
 * Place a PDF at `public/cv.pdf` to enable the "Download PDF" button.
 * Empty lists are hidden on the page.
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
    details: ["Advisor: Prof. Advisor Name"],
  },
  {
    title: "M.Sc. in Computer Science",
    org: "Kurukshetra University",
    location: "Kurukshetra, India",
    period: "2023 - 2025",
  },
];

export const experience: CvEntry[] = [
  {
    title: "Assistant Professor",
    org: "MLN College",
    location: "Yamuna Nagar, India",
    period: "Present", // add the start year, e.g. "2025 – Present"
  },
];

export const teaching: CvEntry[] = [];

export const awards: { title: string; year: string }[] = [
  { title: "Junior Research Fellowship UGC NET-JRF", year: "2025" },
];

export const service: string[] = [];

export const skills: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "C++", "C"] },
  { label: "Frameworks", items: ["PyTorch", "JAX", "CUDA"] },
  { label: "Tools", items: ["Git", "LaTeX"] },
];
