/**
 * Central profile configuration. Edit this file to personalise the site.
 *
 * Links to other websites are "#" placeholders: replace each "#" with the real URL
 * (e.g. "https://pec.ac.in/") and it will open in a new tab automatically.
 */
export const site = {
  name: "Suyash",
  title: "Research Scholar in Computer Science",
  description: "Personal academic website: research, publications, and CV.",
  affiliation: {
    department: "Department of Computer Science & Engineering",
    university: "Punjab Engineering College (PEC), Chandigarh",
    url: "#",
  },
  lab: { name: "Your Research Lab", url: "#" },
  advisor: { name: "Prof. Advisor Name", url: "#" },
  location: "Chandigarh, India",
  email: "suyashsuyash.phd26cse@pec.edu.in",

  /** Each string is rendered as its own paragraph. */
  bio: [
    "Research Scholar (UGC-JRF) in Computer Science. I work on Quantum Error Correction (QEC) to design stable, fault-tolerant algorithms.",
    "I completed my M.Sc. at Kurukshetra University and teach as an assistant professor at MLN College, Yamuna Nagar.",
    "I’m early in my research career and keen to learn, so I welcome conversations with people working on related problems.",
  ],

  researchInterests: [
    "Quantum Computing",
    "Trustworthy AI",
    "Bayesian Network",
    "Semantic AI",
    "Knowledge Graph",
  ],

  socials: {
    github: "#", // e.g. "https://github.com/suygohri-lab"
    scholar: "#", // e.g. "https://scholar.google.com/citations?user=YOUR_ID"
    linkedin: "#", // e.g. "https://www.linkedin.com/in/your-handle"
    email: "#", // e.g. "mailto:suyashsuyash.phd26cse@pec.edu.in"
  },

  /**
   * Every spelling of your name that appears in author lists.
   * Matching authors are rendered in bold on publication cards.
   */
  authorAliases: ["Suyash"],

  /** Newest first, e.g. { date: "2026-09", text: "Paper accepted at ..." }. The section hides when empty. */
  news: [] as { date: string; text: string }[],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Publications", href: "/publications/" },
  { label: "CV", href: "/cv/" },
] as const;
