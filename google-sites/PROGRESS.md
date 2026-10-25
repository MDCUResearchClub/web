# Rebuild progress — Google Sites draft

Working notes for whoever continues the rebuild (person or Claude session). The live site is
<https://sites.google.com/docchula.com/mdcuresearch-docchula>; the editor is the same site with `/edit`.
Target look: the canvas preview <https://claude.ai/artifact/N422zWcJphBrzWR2AQYZMj> and the recipes in
`README.md` §2.3. Edits happen in the **draft** — nothing is live until someone presses Publish.
The old public site <https://sites.google.com/view/mdcuresearch/> belongs to another account and is left as it is:
it is now "the old website", linked from the new site's menu.

## Done

- The redesign below is published (docchula.com visitors see it). Still in the draft only: the **Old website**
  menu link and the Home background anchor change.
- Theme *MDCU Research 2026*: white top navigation, amber underline on the current page,
  amber filled buttons on dark (Style 3) sections.
- **Widgets** (Apps Script project *MDCU site widgets*, owner punnawit.wsr@docchula.com, permissions approved):
  - Public deployment (*Who has access: Anyone*) — used by every embed:
    `https://script.google.com/a/macros/docchula.com/s/AKfycbxlmnnK6IIt1h-rzJELCRfxEcTbSrcWrGe-6LvC7tZD09l8dghRw050lntIXlAVMkPZ/exec`
  - Members deployment (*Anyone within docchula.com*) — opened by "Sign in with docchula.com"; its URL is
    `MEMBERS_APP_URL` in `Config.gs`.
  - Checked from a signed-out client: the public copy sends titles, departments and seats only (every project
    `locked`, no advisor/contact/timeline/description); the members copy redirects to docchula.com sign-in.
- **Home**: hero = native text + `hero-actions` embed (buttons + live numbers) on the left, `open-now` embed
  (three newest projects) on the right, on a background image of the translucent club mark
  (`assets/hero-logo-background.png`, anchored centre, readability adjustment off). 01–03 native. 04 Events = header + `events-home` embed (Upcoming card +
  two "What's new" teasers that link to the Events page). 05 Showcase = header + `showcase-home` embed.
  06 Get involved native.
- **Opportunities**: hero, three steps, `opportunities` embed (project finder) in place of the old sheet embed
  (the sheet itself is unchanged in Drive), For faculty.
- **Events**: hero, `events` embed (Upcoming), Previous events. The First Meet 2026 and How to Design posts were
  moved here from Home (same posters and full text) above Statistics, AI and Lab tour 2.
- **Showcase**: dark hero with `showcase-stats` embed and a native "Add your presentation +" button (links to the
  showcase form), `showcase` embed (search/filter browser), then the year archive (untouched).
- **Footer** (site-wide): three columns — name + description (+ © line), Contact (email, Instagram), Find us.
- **Old website** link at the end of the menu (opens <https://sites.google.com/view/mdcuresearch/> in a new tab).
- Checked before going public: the About page's personal contact is already on the old public site's Contact us
  page; the hidden pages (Conference/Abstract templates, test, Alumni Hall of Fame) hold nothing private.

## To do

1. Owner: **Publish** the draft, then **Share › General access › Published site › Public** so visitors without a
   docchula.com account see the new site (the owner chose this over rebuilding the old public site).
2. Add the faculty form link when it exists (Opportunities "For faculty"; `facultyForm` in `Config.gs`).
3. Move or share the Apps Script project and the *Website data* sheet with researchclub@docchula.com so they
   survive graduation. The script must stay owned by a docchula.com account (member check).
4. Optional data clean-up in *Website data*: the ARC 2024 showcase row is not ticked *Approved* (so the site shows
   30, not 31), and MRPC #20's presenter is listed as "MDCU student".
5. The one-time setup project (*MDCU one-time setup*) can be deleted.

## Maintaining the widgets

- Code changes: edit `google-sites/apps-script/`, run `node --test google-sites/test/*.test.mjs`, paste into the
  project, save, then **Deploy › Manage deployments** and give *each* deployment a **New version**, checking its
  *Who has access* (public = Anyone, members = Anyone within docchula.com). Apps Script stores that setting in the
  version, so creating a version from the wrong dialog can change it.
- Links inside embeds open in a new tab: Google Sites runs embeds in a frame that may not navigate the page.
- Embed sizes (desktop): hero-actions 661×196, open-now 464×520, events-home 1154×634, showcase-home 1154×731,
  opportunities 1154×1149, events 1154×331, showcase-stats ~760×120, showcase 1154×1399. Sites keeps the ratio
  on phones; the widgets switch to compact layouts below 640 px.

## Editor tips (for browser automation)

- Styled text: dispatch a synthetic `paste` ClipboardEvent with `text/html` on the focused text box —
  the editor keeps inline font, size and colour and handles Thai. Don't use the system clipboard.
  Pasted text takes the formatting of what it replaces; fix weight with cmd+a / cmd+b afterwards if needed.
- Paste replaces the selection but can leave an empty last line; remove it by putting the caret at the end
  of the previous line and sending Delete (never Backspace — it can eat the last character).
- Images: a synthetic `drop` DragEvent carrying a `File` uploads and places the image where it is dropped
  (no file dialog, no clipboard). Compute the drop point right before dispatching — the canvas can scroll.
- Side-by-side placement: double-click an empty spot in a section to open the insert wheel there; the new item
  lands in that column. Native buttons can be dragged next to a column with synthetic mouse events.
- Moving components: synthetic mouse events (mousedown → several mousemoves → mouseup) work, but keep
  the drop point away from the top/bottom edge or the canvas auto-scrolls. Resizing handles need real
  mouse drags. Items stacked in one column share its width.
- The small toolbar above a group says "Delete group" — use the item's own toolbar to delete one item.
