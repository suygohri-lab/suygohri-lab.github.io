import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Publications: one Markdown file per paper in `src/content/publications/`.
 * The frontmatter holds the metadata; the (optional) Markdown body is shown
 * as the paper's abstract.
 */
const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    /** Full author list in order. Mark equal contribution with a trailing "*". */
    authors: z.array(z.string()).min(1),
    /** Full venue name, e.g. "Conference on Neural Information Processing Systems". */
    venue: z.string(),
    /** Short venue label for the badge, e.g. "NeurIPS". */
    venueShort: z.string().optional(),
    year: z.number().int(),
    /** Optional month (1-12), used to order papers within the same year. */
    month: z.number().int().min(1).max(12).optional(),
    type: z
      .enum(["conference", "journal", "workshop", "preprint", "thesis"])
      .default("conference"),
    /** Link to the PDF: a URL, a file in `public/papers/`, or "#" as a placeholder. */
    pdf: z.string().optional(),
    /** Link to the code repository, or "#" as a placeholder. */
    code: z.string().optional(),
    /** Any extra links (project page, slides, video, ...). */
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    bibtex: z.string().optional(),
    /** e.g. "Best Paper Award" or "Oral". */
    award: z.string().optional(),
    /** Show on the home page under "Selected Publications". */
    selected: z.boolean().default(false),
    /** Drafts are excluded from the build. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { publications };
