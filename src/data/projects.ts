import type { IconName } from "../components/Icon.astro";

/**
 * Research projects shown on the home page.
 * These are placeholders based on your research interests: replace them with your real work.
 * Add an `image` (a file in public/, e.g. "/projects/qbn.jpg", ideally 16:9) to replace the
 * illustrated placeholder.
 */
export interface Project {
  title: string;
  summary: string;
  status: "Ongoing" | "Completed";
  tags: string[];
  /** Shown on the placeholder when there is no image. */
  icon: IconName;
  image?: string;
  imageAlt?: string;
  link?: { label: string; url: string };
}

export const projects: Project[] = [
  {
    title: "Quantum-Enhanced Bayesian Networks",
    summary:
      "Using quantum circuits to represent and sample from Bayesian networks, aiming for faster probabilistic inference on structured models.",
    status: "Ongoing",
    tags: ["Quantum Computing", "Bayesian Networks"],
    icon: "atom",
  },
  {
    title: "Knowledge Graphs for Semantic AI",
    summary:
      "Building knowledge-graph representations that let AI systems reason over meaning and relationships, not just surface patterns.",
    status: "Ongoing",
    tags: ["Knowledge Graphs", "Semantic AI"],
    icon: "network",
  },
  {
    title: "Trustworthy Quantum Machine Learning",
    summary:
      "Studying how noise and uncertainty affect quantum learning models, and how to make their predictions reliable and explainable.",
    status: "Ongoing",
    tags: ["Trustworthy AI", "Quantum ML"],
    icon: "shield",
  },
];
