/**
 * Attributes for any link whose address comes from data (site.ts, papers, projects).
 * - Real URLs (http/https) open in a new tab.
 * - "#" placeholders (links to other sites that are not filled in yet) are marked
 *   aria-disabled, so screen readers announce them as unavailable; BaseLayout's
 *   script stops them from jumping to the top of the page.
 * - Paths on this site get no extra attributes.
 */
export const linkProps = (href: string) =>
  href === "#"
    ? { "aria-disabled": "true" as const }
    : /^https?:\/\//.test(href)
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
