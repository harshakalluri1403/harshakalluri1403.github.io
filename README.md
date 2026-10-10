# Portfolio

Personal site. Plain HTML, no build step, no framework. Hosted on GitHub Pages as `harshakalluri1403.github.io`.

```
index.html        the main page (never edit)
project.js        draws project pages (never edit)
site.css          styles (never edit)
content.js        EVERYTHING ON THE SITE. The only file that changes.
console.html      form editor for content.js with live preview (see below)
preview.html      shows the full site while it is switched off
_template/        copy this folder to make a new project page
<slug>/           one folder per project page, e.g. bdb27/
images/           thumbnails, gifs and figures
photo.jpg         your photo (add it, square, about 400x400 px)
```

## The console (edit without touching code)

Open `console.html` in a browser, locally or at `https://harshakalluri1403.github.io/console.html` once hosted. It is a form editor for everything on the site, with a live preview on the right:

- **Portfolio live** switch in the top bar: on means the full site is public, off shows visitors only the holding line. With a GitHub token set, flipping it publishes at once.
- **Settings and bio**, **Links** (shown as text under the bio), **Timeline** (logo, years, role, organisation, note).
- **Sections**: every section with its items. Each entry has an **on site** switch in its header row. Items can optionally have a project page (authors, buttons, hero, abstract, figures, BibTeX); none use one at the moment, titles link straight to GitHub or Kaggle.
- **Add section**: presets for News, Talks, Teaching, Awards, Service, Students, Writing, Software, Misc. New sections start hidden.
- **Update site** pushes content.js to GitHub through its API, so the live site changes within a minute. It needs a fine-grained personal access token with *Contents: read and write* on the site repository, pasted once into the **GitHub** panel (it is stored only in that browser). With a token, image fields also get an **Upload** button that puts the file in `images/` for you, and new project page folders are created automatically.
- Without a token: **Download content.js**, replace the file in this folder, then push.

Hidden sections and hidden items stay in content.js but are not shown on the site.

## Is the portfolio up?

In `content.js`, `live: false` shows visitors only your name, one line and your links.
`live: true` shows everything. While it is off, open `preview.html` to see the full site.

## Updating the site

1. Open `content.js`, add or change a block, save.
2. Double-click `index.html` (or `preview.html`) to check it in a browser.
3. Push:

```
git add -A
git commit -m "Update site"
git push
```

The live site updates within about a minute.

- **Timeline** entries: `when`, `what`, `where`, `url`, `note`. Newest at the top.
- **Section items**: `title`, `url`, `kind`, `venue`, `year`, `authors`, `description`, `image`, `gif`, `links`.
- **New section**: add another `{ title: "Talks", items: [ ... ] }` to `sections`.

## Adding a project page

A project page looks like a paper page: title, authors, buttons, a hero image or gif, abstract, figures.

1. Give the item a `slug` (for example `"my-paper"`) and a `page` block. Copy an existing one.
2. Copy the folder `_template` and rename the copy to the slug: `my-paper/`.
3. Put its images in `images/` and reference them as `images/name.png`.

That folder is identical for every page; it reads its own folder name and fills itself from `content.js`.
The item's title on the main page now links to `my-paper/`.

## Hosting

The site is hosted on GitHub Pages from the repository `harshakalluri1403/harshakalluri1403.github.io`, at
https://harshakalluri1403.github.io. While `live` is false, visitors see only the holding line; open
`preview.html` (or the console) in your own browser to see the full site.

To go live: open the console, switch **Portfolio live** on, click **Update site**. Or set `live: true` in `content.js` and push.

Custom domain later: **Settings → Pages → Custom domain**, plus a CNAME record at your registrar pointing to `harshakalluri1403.github.io`.

Custom domain later: **Settings → Pages → Custom domain**, plus a CNAME record at your registrar pointing to `harshakalluri1403.github.io`.
