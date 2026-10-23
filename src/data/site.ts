/**
 * Central profile configuration. Edit this file to personalise the site.
 */
export const site = {
  name: "Your Name",
  title: "Ph.D. Candidate in Computer Science",
  description: "Personal academic website: research, publications, and CV.",
  affiliation: {
    department: "Department of Computer Science",
    university: "Your University",
    url: "https://www.example.edu",
  },
  lab: { name: "Your Research Lab", url: "https://lab.example.edu" },
  advisor: { name: "Prof. Advisor Name", url: "https://www.example.edu/~advisor" },
  location: "City, Country",
  email: "you@example.edu",

  /** Each string is rendered as its own paragraph. */
  bio: [
    "I am a Ph.D. candidate in Computer Science working on trustworthy and efficient machine learning systems. My research sits at the intersection of machine learning, systems, and programming languages, with a focus on methods that are both theoretically grounded and practical at scale.",
    "Previously, I completed my B.S. at Your Undergraduate University and interned at industry research labs. I am always happy to chat about research collaborations.",
  ],

  researchInterests: [
    "Machine Learning",
    "Efficient Deep Learning",
    "ML Systems",
    "Program Synthesis",
    "Trustworthy AI",
  ],

  socials: {
    github: "https://github.com/suygohri-lab",
    scholar: "https://scholar.google.com/citations?user=YOUR_SCHOLAR_ID",
    linkedin: "https://www.linkedin.com/in/your-handle",
  },

  /**
   * Every spelling of your name that appears in author lists.
   * Matching authors are rendered in bold on publication cards.
   */
  authorAliases: ["Your Name", "Y. Name"],

  news: [
    { date: "2026-09", text: "Our paper on adaptive sparse attention was accepted to NeurIPS 2026 as a spotlight." },
    { date: "2026-06", text: "Started a research internship at Example Research Lab." },
    { date: "2026-02", text: "Passed my qualifying exam." },
  ],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Publications", href: "/publications/" },
  { label: "CV", href: "/cv/" },
] as const;
