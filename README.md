# Academic Portfolio

Personal academic website built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed to <https://suygohri-lab.github.io>.

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Project structure

```
.github/workflows/deploy.yml   CI: build + deploy to GitHub Pages on push to main
public/                        Static files (favicon, profile.jpg, cv.pdf, papers/)
src/
  content.config.ts            Publications collection schema
  content/publications/*.md    One Markdown file per paper
  data/site.ts                 Name, bio, affiliation, interests, socials, news
  data/cv.ts                   Education, experience, teaching, awards, service
  components/                  Header, Footer, PublicationCard, Icon, ...
  layouts/BaseLayout.astro     Shared <head>, header/footer, theme script
  pages/                       index, publications, cv, 404
  styles/global.css            Tailwind entry point + theme tokens
```

## Personalising

- **Profile**: edit `src/data/site.ts`. Add every spelling of your name to `authorAliases` so it is bolded in author lists.
- **Photo**: add `public/profile.jpg` (square). Until then an initials avatar is shown.
- **CV PDF**: add `public/cv.pdf` to enable the "Download PDF" button on the CV page.

## Adding a publication

Create `src/content/publications/<slug>.md`:

```markdown
---
title: "Paper Title"
authors: ["Your Name*", "Co-Author*", "Advisor"]   # * = equal contribution
venue: "International Conference on Machine Learning"
venueShort: "ICML"
year: 2026
month: 7                  # optional, orders papers within a year
type: conference          # conference | journal | workshop | preprint | thesis
pdf: "https://arxiv.org/abs/..."   # or "/papers/my-paper.pdf" in public/papers/
code: "https://github.com/..."
links:                    # optional extra buttons
  - label: "Slides"
    url: "https://..."
award: "Oral"             # optional badge
selected: true            # show on the home page
draft: false
bibtex: |
  @inproceedings{...}
---

Optional abstract in Markdown. When present, an "Abstract" toggle appears on the card.
```

## Deployment

This is a GitHub Pages **user site**, so the repository must be named `suygohri-lab.github.io`.

1. Push this project to the `main` branch of `github.com/suygohri-lab/suygohri-lab.github.io`.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes the site.
