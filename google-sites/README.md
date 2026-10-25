# MDCU Research Division — Google Sites upgrade

The site stays on **Google Sites**, so anyone on the team can keep editing pages — and adding photos and
posters — the way they do now. What changes:

- **New look and structure** — one custom theme, five pages (Home, Opportunities, Events, Showcase, About),
  with the old site's messages kept: the hero subtitle, the "MDCU Research club" quote, both mission
  statements, the "Our impact" lines and every past activity post.
- **Live sections** for the things that go stale. They read Google Sheets and Forms through a small Apps Script
  web app (`apps-script/`) embedded in the pages. Edit a row → the site updates within ~5 minutes.

| Section | Content comes from | Updated by |
| --- | --- | --- |
| Page wording, mission, Executive Board, footer | Google Sites editor | PR & Content team |
| **Activity posts** ("What's new", "Previous events") with photos and posters | Google Sites editor — *Insert › Images* | Activity team |
| Upcoming events (auto-hide after the date) | **Website data** sheet › `Events` tab | Activity team |
| Opportunities finder — titles public, **details only for docchula.com sign-ins** | The existing **Research opportunities** sheet (faculty form) | Faculty, via the form |
| Research Showcase | Showcase form → **Website data** › `Showcase` tab, after a tick in `Approved` | Students submit, team approves |

---

## 1. One-time setup (about an hour, done once)

### 1.1 Own everything with the club account

Create the sheet, form and Apps Script projects while signed in as **researchclub@docchula.com**
(or move them into a shared drive). If they belong to a student's personal account, the site breaks when
that student graduates — and the sign-in check in §1.4 only works when the owner is a docchula.com account.

### 1.2 "Website data" sheet

1. Create a Google Sheet called **Website data**.
2. Rename the first tab to `Events`, then **File › Import › Upload** `templates/events.csv` → *Replace current sheet*.
   Past rows are harmless; only events dated today or later appear on the site.
3. Tidy the columns so nobody can type the wrong thing:
   - `Date` → **Format › Number › Date**
   - `Type` → **Data › Data validation** › dropdown: `Workshop, Lab tour, Research talk, Meetup, Other`
   - `Status` → dropdown: `Open, Full, Closed, Cancelled`
   - `Show on site` → **Insert › Checkbox**
   - `Poster link` (optional) → a Drive link to the poster, shared as *Anyone with the link — Viewer*.
4. Share the sheet with the team as **Editor**.

### 1.3 Showcase form

Create a Google Form **Add my presentation to the MDCU Research Showcase**, restricted to docchula.com.
Use these question titles exactly (the widget finds columns by these words; the Thai part is optional):

| Question title | Type |
| --- | --- |
| Presenter name / ชื่อผู้นำเสนอ | Short answer |
| Class (e.g. MDCU78) / รุ่น | Short answer |
| Conference name / ชื่องานประชุม | Short answer |
| Short name (e.g. VSS 2026) / ชื่อย่อ | Short answer |
| City, country / เมือง | Short answer |
| Conference date / วันที่นำเสนอ | Date |
| Format / รูปแบบ | Multiple choice: Oral presentation, Poster presentation, Other |
| Research title / ชื่องานวิจัย | Short answer |
| Research field / สาขา | Short answer |
| Keywords / คำสำคัญ | Short answer |
| Advisors / อาจารย์ที่ปรึกษา | Short answer |
| Abstract / บทคัดย่อ | Paragraph |
| Reflection / สิ่งที่ได้เรียนรู้ | Paragraph (optional) |
| Photo / รูป | File upload (optional, image) |
| Consent / ยินยอม | Checkbox, required: "I agree that my name, class, photo and research details are shown on the club website" |

Then **Responses › Link to Sheets › Select existing spreadsheet › Website data**, rename the new tab to
`Showcase`, and add a last column titled `Approved` filled with checkboxes. Only ticked rows appear on the site.

To bring over the 31 presentations from the old *Researcher Profile* pages, paste them under the matching
headers (see `templates/showcase-import.csv`) and tick `Approved` for those whose presenters gave consent.

> Photos and posters from Drive only display if the file is shared as *Anyone with the link — Viewer*.
> Otherwise the widget quietly shows the presenter's initial instead, or leaves the poster out.

### 1.4 Apps Script web app — one project, two deployments

Opportunity details (advisor, contact, timeline, description, what to send) are only for MDCU students.
The script removes them on the server for anyone who isn't signed in with a **docchula.com** account, so they
never reach a signed-out visitor's browser. Titles, departments, topics and seat counts stay public.

Google only tells a script who the visitor is in some setups, so the same project is deployed twice:

| Deployment | Who has access | Used for |
| --- | --- | --- |
| **Public** | Anyone | Every embed on the site. Details are hidden unless Google reports a docchula.com visitor. |
| **Members** | Anyone within docchula.com | Opened by the "Sign in with docchula.com" button. Google asks for a docchula.com sign-in, then shows everything. |

1. <https://script.google.com> → **New project** (*MDCU site widgets*), owned by the club's docchula.com account.
2. **Project Settings** → tick *Show "appsscript.json" manifest file*, then paste `apps-script/appsscript.json`.
3. Create the files and paste their contents: `Parse.gs`, `Config.gs`, `Code.gs` (script files) and
   `Widget.html`, `Styles.html`, `App.html` (HTML files — name them without the extension).
   *(Or use [clasp](https://github.com/google/clasp): `clasp create --type webapp --rootDir google-sites/apps-script`, then `clasp push`.)*
4. In `Config.gs`, set `WEBSITE_DATA_SHEET_ID` (the long ID in the sheet's URL) and the two form links.
5. Run `authorize` once from the editor and approve the prompt (tick every box). Google words it as access to
   your spreadsheets because opening a sheet by its ID has no read-only option; the script only reads them. It also
   sees the visitor's email address, only to check that it ends in `@docchula.com` (it isn't stored).
6. **Deploy › New deployment › Web app** — *Execute as:* **Me**, *Who has access:* **Anyone**. This is the public URL
   used in every embed. Then **Deploy › New deployment** again with *Who has access:* **Anyone within docchula.com**.
7. Paste the members URL into `MEMBERS_APP_URL` in `Config.gs`, save, and move both deployments to a new version
   (below). Open the public URL with `?view=opportunities` on the end to check it works.

If the whole site stays docchula.com-only, one deployment is enough: deploy it for *Anyone within docchula.com* and
leave `MEMBERS_APP_URL` blank.

After a code change, use **Deploy › Manage deployments › Edit › New version** for each deployment, so the URLs stay the same.
To show a sheet edit immediately instead of within 5 minutes, run `clearCache` from the editor.

---

## 2. Rebuilding the pages in Google Sites

Edits stay in draft until someone presses **Publish**. Tell the other editors not to publish until the team
has reviewed the draft, and use **⋮ › Version history** if anything needs rolling back.

**Nothing from the old site is deleted.** Pages that are replaced are hidden from navigation, their wording is
reused, and page addresses stay the same so old links keep working (rename the *title* only).

### 2.1 Theme

**Themes › Custom › +** (start from *Simple*), name it *MDCU Research 2026*, upload the logo, then:

| Setting | Value |
| --- | --- |
| Main / button colour | `#16305A` (navy) — button text white |
| Accent | `#F4B13A` (amber) |
| Section style *Emphasis 1* | background `#F4F7FA` |
| Section style *Emphasis 2* | background `#0B1630`, text white |
| Title, Heading | IBM Plex Sans Thai, bold, `#16305A` |
| Subheading, Normal text | IBM Plex Sans Thai, `#1B2537` |
| Small text (eyebrows, captions) | IBM Plex Mono |
| Navigation | IBM Plex Sans Thai; light background |

If a font isn't offered, use *Noto Sans Thai* (both cover Thai and English).

### 2.2 Pages and navigation

`Home · Opportunities · Events · Showcase · About`

- Rename the *titles* **Researcher Profile → Showcase** and **Previous events → Events**.
- Keep *Our Structure* and *Our Impact* as sub-pages of About (or hide them once their content is on About).
- Once the Showcase widget is filled, **hide** the 24 conference pages from navigation — keep them as an archive.

### 2.3 Page recipes

Embeds: **Insert › Embed › By URL** → paste the **public** web app URL plus the view below. Embed boxes have a
fixed height in Sites; anything taller scrolls inside the box, so start with the heights given and adjust.

**Home**
1. Header *Title only*. First section **Emphasis 2**, two columns.
   Left — *Small text* "MDCU Research Division", title "Today’s research, / tomorrow’s cure." (second line in
   amber `#F4B13A`), *Small text* credit "Inspired by Mayo Clinic’s “Tomorrow’s Cure”", the old subtitle
   "A student-led research club affiliated with the Student Union of the Faculty of Medicine, Chulalongkorn
   University", then embed `?view=hero-actions` (the two buttons and the live numbers, about 660 × 200 px).
   Right — embed `?view=open-now` (about 460 × 520 px). Double-click the empty right half of the section to
   insert it there.
   Background: **Section colors › Image › Select › By URL** with the raw GitHub link to
   `assets/hero-logo-background.png` (the club mark, faint, on navy). Then click the sparkle icon to remove the
   *readability adjustment* and leave **Anchor image** in the centre: the mark sits at the right on laptops and
   drops out of view on phones, like the design. Dark widgets are transparent, so it shows behind them. To change
   the mark, edit `assets/hero-logo-background.svg`, mirror the change in `assets/render-hero-background.mjs`
   and run it (`node google-sites/assets/render-hero-background.mjs`).
2. **MDCU Research club** — the old quote ("We are the community of medical students…") beside the group photo,
   **About us** button.
3. **Our mission** (Emphasis 1) — the two old statements, each with its photo and the old buttons
   (**Researcher requirements**, **Previous events**, **Researcher profiles**).
4. **Our impact** — four columns: Research Workshop, Lab tour, Research Talk (old lines) and Opportunities Board.
5. **Events** (Emphasis 1) — eyebrow, title and **All events** link, then embed `?view=events-home` (about 630 px):
   the next event plus the two latest activities as short "What's new" teasers. The full posts (poster +
   collapsible text) live on the Events page.
6. **Research showcase** — title, intro and **Explore the showcase** link, embed `?view=showcase-home` (about 730 px).
7. **Get involved** (Emphasis 2) — three columns with buttons (Opportunities, Instagram, Facebook group).

**Opportunities** — intro text, a three-step "How it works" row, embed `?view=opportunities` (about 1150 px),
section **Emphasis 1** "For faculty" with **Post a project** (faculty form) and **Email the club** buttons.

**Events** — intro text, embed `?view=events` (about 330 px), then **Previous events**: the existing activity posts
(poster or photos + title + collapsible text), newest first. To add one, duplicate a post section
(**⋮ › Duplicate section**), replace the image (**Insert › Images** or click the image › **Replace image**) and
the text, and drag it to the top.

**Showcase** — Emphasis 2 header with the old intro "Researcher profiles & project highlights by MDCU's researchers"
and embed `?view=showcase-stats` (about 120 px) on the left, an **Add your presentation** button (showcase form) on
the right; then embed `?view=showcase` (about 1400 px) and the year-by-year archive of the old conference pages.

**About** — mission (two columns on Emphasis 2), Executive Board 2026 (board poster or image + name + role grid),
Core Team photo, contact list, Google Maps embed. **Footer**: three columns — name and description (with the ©
line), Contact (email, Instagram), Find us (address).

---

## 3. Everyday updates — no code

| Job | Where | Time |
| --- | --- | --- |
| Announce an event | Website data › Events — add a row (add a poster link if you have one) | ~2 min |
| Event full / closed | Events › `Status` | 10 s |
| Post photos or a recap of an activity | Sites editor › Events — duplicate a post, swap image and text, Publish | ~10 min |
| Publish a presentation | Website data › Showcase › tick `Approved` | 1 min |
| A project is filled | Opportunities sheet › status → `Closed` | 10 s |
| New academic year | Opportunities sheet › duplicate the tab, rename e.g. `2027-2028` (newest is shown automatically) | ~2 min |
| New Executive Board / wording / photos | Sites editor › edit › Publish | 5–15 min |

Upcoming events drop off the list on their own the day after they happen. A row with a missing title or an
unreadable date is skipped instead of breaking the page.

---

## 4. Content fixes found while auditing the current site

- **"What's new [Jul 2026]" and "[Jan 2026]"** sit on Home months later; registration links are hidden inside
  collapsed text. → The live "Upcoming" box handles announcements; the posts stay as activity posts.
- **Previous events** has two empty image boxes (Lab tour 2 and an empty row) and is missing the Jan 2026 workshop.
- **About** publishes a former secretary's personal phone number and LINE ID. → Use the club email and Instagram.
- **Researcher Profile**: the VSS 2024 page is titled *Asian Pacific Digestive Week 2024*; the ARC 2024 abstract page
  has no title or presenter; TERMIS EU 2025 and HIV Drug Therapy Glasgow 2024 are listed but have no page;
  MRPC 2024 is dated Feb 2025; one presenter's name is spelled two ways; typos such as "reseach", "Internation",
  "systemic review".
- **Opportunities sheet**: the same department is typed several ways (the widget merges them via `DEPT_ALIASES`);
  one project summary is garbled Thai pasted from a PDF; academic titles are in mixed order (the widget reorders them).
- **Page headers**: the two logos overlap the page title on every page.
- **Name**: "MDCU Research Division" and "MDCU Research Club" are used interchangeably — pick one.
- **First Meet 2026** venue differs between the poster (2nd floor) and the text (floor M).

## 5. Decision for the team: who can see the site?

Today the published site — and `researchclub.docchula.com`, which redirects to it — asks every visitor to sign in
with a **docchula.com** account, so prospective members, faculty using other accounts, partners and search engines
see nothing. With the two-copy setup in §1.4 the site can be published to **Anyone** (Publish › Settings): visitors
see everything except opportunity details, which stay behind the docchula.com sign-in.

## 6. Developing

```bash
node --test google-sites/test/*.test.mjs      # parser + widget tests (Node 18+)
node google-sites/test/preview.mjs            # renders every view to google-sites/test/out/*.html
```

`test/harness.mjs` runs the real `.gs` files with stand-ins for SpreadsheetApp, CacheService, HtmlService and
Session (to simulate signed-in and signed-out visitors), using the placeholder data in `test/fixtures.mjs`.
Keep real names and contact details out of the fixtures — this repository is public.
