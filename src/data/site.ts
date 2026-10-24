/**
 * Central profile configuration. Edit this file to personalise the site.
 */
export const site = {
  name: "Suyash",
  title: "Research Scholar in Computer Science",
  description: "Personal academic website: research, publications, and CV.",
  affiliation: {
    department: "Department of Computer Science & Engineering",
    university: "Punjab Engineering College (PEC), Chandigarh",
    url: "https://pec.ac.in/",
  },
  // lab: { name: "Your Research Lab", url: "https://lab.example.edu" },
  // advisor: { name: "Prof. Advisor Name", url: "https://www.example.edu/~advisor" },
  location: "Chandigarh, India",
  email: "suyashsuyash.phd26cse@pec.edu.in",

  /** Each string is rendered as its own paragraph. */
  bio: [
    "Research Scholar (UGC-JRF) in Computer Science I work on Quantum Computing and Artificial Intelligence, with a focus on how quantum approaches can be used to design AI algorithms. I completed my M.Sc. at Kurukshetra University and teach as an assistant professor at MLN College, Yamuna Nagar. I’m early in my research career and keen to learn, so I welcome conversations with people working on related problems.",
  ],

  researchInterests: [
    "Quantum Computing",
    "Trustworthy AI",
    "Bayesian Network",
    "Semantic AI",
    "Knowledge Graph",
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
