# Point Engineering Offsite 2026 — afternoon sign-ups

A single static page where 50 people put their name on one of six Wednesday
afternoon activities. Sign-ups are stored as rows in a Google Sheet, so you
can open the sheet and fix anything by hand without losing data.

Live at <https://ryan-evans-point.github.io/eng-offsite-9-2026/>

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page. Static markup plus the sign-up modal. |
| `styles.css` | All styling. |
| `app.js` | All behaviour. Activity copy lives in the `ACTIVITIES` array at the top. |
| `Code.gs` | The backend. **Not served** — this gets pasted into the Google Sheet. |
| `og.png` | Slack/link preview image. |
| `og.html` | Throwaway source used to render `og.png`. Not served. |

There is no build step and no dependencies. Open `index.html` in a browser
and it works.

## How the data flows

The page reads the whole roster on load and again whenever the tab regains
focus, and writes a single row each time someone signs up or leaves.

```
browser  ──GET──▶  Apps Script doGet   ──▶  Google Sheet "signups" tab
         ──POST─▶  Apps Script doPost  ──▶  (one row per person)
```

One row per person, upserted on the `key` column. Sign-ups are one-per-person,
so moving to a different activity updates that person's existing row rather
than adding another.

## Setup, once

The Google side takes about five minutes and is all clicking. There is no
OAuth flow, no API key, and no service-account JSON. Nothing secret goes in
this repo.

> **Use a personal Google account, not your point.com one.** Point's Workspace
> blocks public Apps Script deployments, so the `Anyone` access level we need
> is missing from the dropdown on a point.com account. See "Gotchas" below.

1. Create a Google Sheet in a personal Google account. Name it whatever you
   like.
2. **Extensions > Apps Script.** Delete the placeholder, paste all of
   `Code.gs`, save.
3. **Run > setup.** This creates the `signups` tab, the header row, the
   activity dropdown, and the checkboxes. Google will ask you to authorize —
   this is the only authentication step in the whole project, and it grants
   your own script access to your own spreadsheet.
4. **Deploy > New deployment > Web app**, with:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the `/exec` URL it gives you into `ENDPOINT` at the top of `app.js`.
6. Commit and push. GitHub Pages serves from `main`.

Because the script executes as you, it already carries your permission to
write to the sheet. Nobody signing up needs a Google account, and they never
see a permission prompt.

## Editing the data by hand

Open the sheet and edit cells. The page picks changes up on the next load.

- **Move someone** — change their `activity` cell using the dropdown.
- **Remove someone** — delete the row.
- **Fix a typo in a name** — edit the `name` cell. Leave `key` alone; the
  script falls back to matching on name, so they won't get a duplicate row.
- **Anonymous sign-ups** have an empty `name` and a `key` starting with `a:`.
  They still count toward the headcount.

Valid `activity` values are the ids, not the titles: `hang`, `beer`,
`capitola`, `disc`, `bike`, `hike`. Rows with an unrecognised activity are
ignored rather than breaking the page.

## Changing the copy

Everything readable lives in `app.js`:

- `ACTIVITIES` — titles, taglines, notes, links, costs, drive times, map pins.
- `SCHEDULE` — the Wednesday timeline. `tbd: true` greys a row out.
- `DEADLINE` — one string, used everywhere the date appears.
- `HEADCOUNT` — the denominator on the RSVP counter.

## Gotchas

**The script cannot live in a point.com account.** The `Who has access:
Anyone` option only appears if the Workspace admin has enabled Drive and Docs
> Sharing settings > sharing outside the domain, plus "Allow users to publish
files on the web". Point has this off, which is reasonable for a fintech, so
the option simply is not in the dropdown.

Two ways this bites you:

- A deployment restricted to the domain produces a URL containing
  `/a/macros/point.com/`, and it redirects anonymous visitors to a Google
  login page. The page would then silently show an empty roster forever,
  because `fetch` receives a login page instead of JSON.
- `Execute as: Me` does **not** rescue this. That setting controls whose
  permissions the code runs with; `Who has access` controls who may invoke the
  web app at all. Google checks the caller at the door, before your code runs,
  so there is nothing to "pass through" your account.

Also note that Apps Script caches the domain sharing policy at the moment the
script project is created. If that setting were ever enabled later, an
existing script would keep hiding the option and you would need a brand-new
script project.

**Redeploying the script.** Editing `Code.gs` in the Apps Script editor does
nothing on its own. Changes only go live via **Deploy > Manage deployments >**
pencil icon **> Version: New version > Deploy.** The URL stays the same. This
catches everyone at least once.

**The endpoint is public.** Anyone with the `/exec` URL can write to the
sheet, and the URL is visible in `app.js`. For an internal offsite page that
is usually fine. A secret in the client JavaScript would not help, since it
ships to the browser too. If it becomes a problem, the sheet has full version
history under File > Version history.

**The Pages site is public** even though it started as a private repo.
Access-controlled Pages is an Enterprise-only feature, so treat the roster as
public information.

**If the site moves,** update both `og:url` and `og:image` in `index.html`.
They are absolute because Slack does not reliably unfurl relative paths.

**Local development.** Leave `ENDPOINT` empty and sign-ups stay in memory for
that tab only, which is the fastest way to check copy and layout. Set it to
the real URL to test against the sheet.
