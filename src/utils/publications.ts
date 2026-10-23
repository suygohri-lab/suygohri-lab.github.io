import { getCollection, type CollectionEntry } from "astro:content";
import { site } from "../data/site";

export type Publication = CollectionEntry<"publications">;

/** All non-draft publications, newest first. */
export async function getPublications(): Promise<Publication[]> {
  const pubs = await getCollection("publications", ({ data }) => !data.draft);
  return pubs.sort(
    (a, b) =>
      b.data.year - a.data.year ||
      (b.data.month ?? 0) - (a.data.month ?? 0) ||
      a.data.title.localeCompare(b.data.title),
  );
}

/** Group publications by year, preserving newest-first order. */
export function groupByYear(pubs: Publication[]): [number, Publication[]][] {
  const groups = new Map<number, Publication[]>();
  for (const pub of pubs) {
    const list = groups.get(pub.data.year) ?? [];
    list.push(pub);
    groups.set(pub.data.year, list);
  }
  return [...groups.entries()];
}

const normalize = (name: string) => name.replace(/[*†‡]/g, "").trim().toLowerCase();
const selfNames = new Set<string>(site.authorAliases.map(normalize));

/** True when an author-list entry is one of the site owner's name variants. */
export const isSelf = (author: string) => selfNames.has(normalize(author));
