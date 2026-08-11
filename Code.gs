/* ============================================================
   Santa Cruz Offsite 2026 — sign-up backend.

   This file is not served with the site. It lives inside the
   Google Sheet: Extensions > Apps Script, paste, save.

   Setup, once:
     1. Run > setup            builds the tab, headers, dropdown
     2. Deploy > New deployment > Web app
          Execute as:      Me
          Who has access:  Anyone
     3. Copy the /exec URL into ENDPOINT at the top of app.js

   Editing this file later does nothing on its own. Changes only
   go live via Deploy > Manage deployments > edit > New version.
   ============================================================ */

const TAB = "signups";
const HEADERS = ["updated_at", "key", "name", "activity", "seats", "can_lead", "note"];
const ACTIVITY_IDS = ["hang", "beer", "capitola", "disc", "bike", "hike"];

/* ---------------- one-time sheet setup ---------------- */
function setup() {
    const ss = SpreadsheetApp.getActive();
    const sh = ss.getSheetByName(TAB) || ss.insertSheet(TAB);

    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
    sh.setFrozenRows(1);

    /* dropdown and checkboxes so hand-edits can't produce a value
       the page won't recognise */
    sh.getRange("D2:D").setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(ACTIVITY_IDS, true).build()
    );
    sh.getRange("F2:F").insertCheckboxes();

    sh.setColumnWidth(1, 160);
    sh.setColumnWidth(2, 170);
    sh.setColumnWidth(7, 340);
}

/* Run this from the editor (Run > whichSheet) when rows seem to be
   going nowhere. It prints the spreadsheet this script is actually
   bound to, which is not always the one you have open. */
function whichSheet() {
    const ss = SpreadsheetApp.getActive();
    const tabs = ss.getSheets().map(s => s.getName() + " (" + s.getLastRow() + " rows)");
    Logger.log("Spreadsheet: %s", ss.getName());
    Logger.log("URL:         %s", ss.getUrl());
    Logger.log("Tabs:        %s", tabs.join(", "));
    Logger.log("Reading tab: %s", TAB);
    Logger.log("Roster now:  %s", JSON.stringify(roster_()));
}

/* ---------------- helpers ---------------- */
function sheet_() {
    const sh = SpreadsheetApp.getActive().getSheetByName(TAB);
    if (!sh) throw new Error('No tab named "' + TAB + '". Run setup() first.');
    return sh;
}

function json_(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj))
        .setMimeType(ContentService.MimeType.JSON);
}

function rows_() {
    const sh = sheet_();
    if (sh.getLastRow() < 2) return [];
    return sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues();
}

/* a checkbox gives a boolean, a hand-typed cell gives a string */
function truthy_(v) {
    if (v === true) return true;
    const s = String(v).trim().toLowerCase();
    return s === "true" || s === "yes" || s === "y" || s === "1";
}

function clean_(v, max) {
    const s = String(v == null ? "" : v).trim();
    return s ? s.slice(0, max) : "";
}

/* the exact shape app.js renders: { activityId: [person, ...] } */
function roster_() {
    const out = {};
    rows_().forEach(r => {
        const key = clean_(r[1], 120);
        const activity = clean_(r[3], 40);
        if (!key || ACTIVITY_IDS.indexOf(activity) === -1) return;
        if (!out[activity]) out[activity] = [];
        out[activity].push({
            key: key,
            name: clean_(r[2], 80) || null,
            seats: Math.max(0, Math.min(12, Number(r[4]) || 0)),
            canLead: truthy_(r[5]),
            note: clean_(r[6], 220) || null
        });
    });
    return out;
}

/* Sheet row number for this person, or 0. Matches on key, then falls
   back to name so renaming someone in the sheet doesn't hand them a
   second row the next time they touch the page. */
function findRow_(key, name) {
    const data = rows_();
    const k = clean_(key, 120).toLowerCase();
    const n = clean_(name, 80).toLowerCase();

    for (let i = 0; i < data.length; i++) {
        if (clean_(data[i][1], 120).toLowerCase() === k) return i + 2;
    }
    if (n) {
        for (let i = 0; i < data.length; i++) {
            if (clean_(data[i][2], 80).toLowerCase() === n) return i + 2;
        }
    }
    return 0;
}

/* ---------------- writes ---------------- */
function upsert_(body) {
    const activity = clean_(body.activity, 40);
    if (ACTIVITY_IDS.indexOf(activity) === -1) throw new Error("Unknown activity: " + activity);

    const key = clean_(body.key, 120);
    if (!key) throw new Error("Missing key.");

    const row = [
        new Date(),
        key,
        clean_(body.name, 80),
        activity,
        Math.max(0, Math.min(12, Number(body.seats) || 0)),
        !!body.canLead,
        clean_(body.note, 220)
    ];

    const sh = sheet_();
    const at = findRow_(key, body.name);
    if (at) sh.getRange(at, 1, 1, HEADERS.length).setValues([row]);
    else sh.appendRow(row);
}

function remove_(body) {
    const at = findRow_(body.key, body.name);
    if (at) sheet_().deleteRow(at);
}

/* ---------------- endpoints ---------------- */
function doGet() {
    try {
        return json_({ ok: true, signups: roster_() });
    } catch (err) {
        return json_({ ok: false, error: String(err.message || err) });
    }
}

function doPost(e) {
    const lock = LockService.getScriptLock();
    /* 50 people may hit this at once, and every write is a
       read-modify-write against the same rows */
    try {
        lock.waitLock(20000);
    } catch (err) {
        return json_({ ok: false, error: "Sheet busy, try again." });
    }

    try {
        const body = JSON.parse(e.postData.contents);
        if (body.action === "leave") remove_(body);
        else upsert_(body);
        SpreadsheetApp.flush();
        return json_({ ok: true, signups: roster_() });
    } catch (err) {
        return json_({ ok: false, error: String(err.message || err) });
    } finally {
        lock.releaseLock();
    }
}
