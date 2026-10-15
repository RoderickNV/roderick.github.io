# Notes for Claude

This repo is the **old** GitHub Pages version of Rob Roderick's personal site. The live site,
**robertroderick.com**, is a separate static site deployed to Vercel (project `robertroderick`).

Before doing anything on robertroderick.com, read:

1. [`CONTEXT.md`](./CONTEXT.md): what the site is, who it's for, voice, facts, SEO status, and **where we left off**
2. [`ENGINEERING.md`](./ENGINEERING.md): how it's built, deployed, how to publish a blog post, the SEO implementation

Ground rules:
- The site's build source (`build.js`, `assets/content.js`, `posts/`) is local-only (see ENGINEERING.md §2).
  Don't assume the HTML in this repo matches production. Fetch the live site or the Vercel deployment instead.
- Keep the `Person` structured data identical on every page that has it (ENGINEERING.md §8).
- This repo is public: no secrets, `.vercel/` folders, or personal contact details.
- At the end of a session, update CONTEXT.md §9 "Where we left off", and the blog and ranking tables if they changed.
- Rob is a product manager: explain changes in plain, step-by-step language.
