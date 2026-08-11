/* ============================================================
   Santa Cruz Offsite 2026 — afternoon sign-ups
   Vanilla JS. Sign-ups live in a Google Sheet, reached through the
   Apps Script web app in Code.gs. With ENDPOINT empty the page runs
   local-only. See README.md.
   ============================================================ */

/* ---------------- icons (inline, lucide-flavoured) ---------------- */
const S = p =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";

const ICON = {
    sun: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    beer: S('<path d="M6.5 4h11l-1.3 15.7a2.2 2.2 0 0 1-2.2 2h-4a2.2 2.2 0 0 1-2.2-2Z"/><path d="M6.9 9.2h10.2"/><path d="M10.6 12.6v5.2M13.4 12.6v5.2"/>'),
    coffee: S('<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/><path d="M6 2v3M10 2v3M14 2v3"/>'),
    disc: S('<ellipse cx="12" cy="12" rx="9" ry="4.6"/><ellipse cx="12" cy="12" rx="4" ry="1.9"/>'),
    bike: S('<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M12 17.5 8.5 9l3-3 3 4h3"/>'),
    trees: S('<path d="M8 2 4 8h2.5L3.5 13H7l-2 4h10l-2-4h3.5L13.5 8H16L12 2"/><path d="M10 17v5M14 17v5"/>'),
    link: S('<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><path d="M8 12h8"/>'),
    check: S('<path d="M20 6 9 17l-5-5"/>'),
    plus: S('<path d="M12 5v14M5 12h14"/>'),
    swap: S('<path d="M7 4 3 8l4 4"/><path d="M3 8h13a4 4 0 0 1 0 8h-1"/>'),
    wave: S('<path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>'),
    ext: S('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
    car: '<svg class="ico" viewBox="0 0 22 14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M2 10.2V7l2.2-4h9.6L18 7l2 .6v2.6"/><path d="M2 10.2h18"/><circle cx="6.5" cy="10.6" r="1.9"/><circle cx="15.5" cy="10.6" r="1.9"/></svg>'
};

/* ---------------- content, ordered chillest first ---------------- */
const ACTIVITIES = [
    {
        id: "hang", n: 1, theme: "t-pool", icon: "sun", accent: "#06B6D4",
        title: "Poolside Chill & Unwind",
        tag: "You just got to the California coast. Yeah, you're gonna chill.",
        badge: { text: "Low intensity · chill", icon: "sun" },
        chill: 4, chillLabel: "horizontal",
        tags: ["chill"], cost: 0, drive: "0 min · you're already here",
        pin: [668, 412], labelDx: 14, labelDy: 14,
        notes: [
            "A lawn chair, an ocean, and absolutely nowhere to be.",
            "We'll probably be by the pool. Wander off and nobody will notice.",
            "California vibing. Out here that counts as an activity.",
            "Or the single most glorious nap you will have all year.",
            "Bring the book you keep meaning to read. Or don't. Nobody is checking.",
            "Also the fallback if the marine layer refuses to lift."
        ],
        links: [], lead: "You're on your own. You got this."
    },
    {
        id: "beer", n: 2, theme: "t-beer", icon: "beer", accent: "#D97706",
        title: "Beer Thirty & Cornhole",
        tag: "Craft bottle shop and beer garden. Cornhole bracket included.",
        badge: { text: "Bracket play" },
        chill: 12, chillLabel: "beer in hand",
        tags: ["dine"], cost: 2, drive: "4 min drive",
        pin: [341, 345], labelDx: -108, labelDy: -12,
        notes: [
            "Cornhole bracket, teams drawn at random. Trophy TBD, glory guaranteed.",
            "Does Point have an official cornhole champion? No. Does it need one? Also no. Could it be you? Yes.",
            "Ping pong and darts if brackets aren't your thing.",
            "A wall of taps and a fridge full of bottles. Choice paralysis is part of the experience.",
            "Outside food allowed. Wood-fired pizza next door, ordered around 3.",
            "Cider, wine, and non-alcoholic options too. Nothing here requires drinking beer."
        ],
        links: [
            ["beer thirty", "http://www.beerthirtysantacruz.com/"],
            ["map", "https://www.google.com/maps/search/?api=1&query=Beer+Thirty+Bottle+Shop+Pour+House"]
        ],
        lead: "Lead: open"
    },
    {
        id: "capitola", n: 3, theme: "t-capitola", icon: "coffee", accent: "#FB923C",
        title: "Capitola Village Walk",
        tag: "Coffee, sand, and a village you can cross in ten minutes. No itinerary, by design.",
        badge: { text: "Pastel cottages & beach", icon: "coffee" },
        chill: 22, chillLabel: "flat and easy",
        tags: ["chill", "dine"], cost: 1, drive: "10 min drive",
        pin: [363, 407], labelDx: -118, labelDy: 22,
        cottages: ["#FBCFE8", "#FDE68A", "#A5F3FC", "#FDBA74", "#C7D2FE", "#99F6E4", "#FCA5A5"],
        notes: [
            "Oldest seaside resort town in California, and it looks it. Pastel cottages stacked right up against the sand.",
            "Coffee at Mr Toots, up the white staircase, balcony hanging out over the water.",
            "The beach is right there. Walk the sand, put a foot in, argue about how cold it is.",
            "Split up, regroup, split up again. Coffee people, shop people, wharf people, sit-on-the-sand people.",
            "There is no plan. That's the plan. Do whatever feels right and meet back at the cars.",
            "Paid parking and the lots fill. Carpool, and agree on a regroup spot before everyone scatters."
        ],
        links: [
            ["mr toots", "https://www.google.com/maps/search/?api=1&query=Mr+Toots+Coffeehouse+Capitola"],
            ["walking map", "https://www.google.com/maps/search/?api=1&query=Capitola+Village"]
        ],
        lead: "Lead: open"
    },
    {
        id: "disc", n: 4, theme: "t-disc", icon: "disc", accent: "#4D7C0F",
        title: "DeLaveaga Disc Golf",
        tag: "Casual front nine. Nobody knows what they're doing. That is the point.",
        badge: { text: "Hillside course", icon: "disc" },
        chill: 32, chillLabel: "walking uphill",
        tags: ["active"], cost: 1, drive: "20–25 min drive",
        pin: [123, 233], labelDx: 14, labelDy: -10,
        stats: [["Front 9", "Holes played"], ["~1.4 mi", "Moderate hillside"]],
        notes: [
            "One of the most famous courses in the country, and it happens to be twenty minutes away.",
            "No golf carts, so there's a bit of a walk either way. Difference is you get to throw something.",
            "Front 9 only. The full 27 is a death march.",
            "Nobody here is good at this. That is genuinely the best part.",
            "Discs: we'll buy them on Amazon, about $7 a head. Do a quick Venmo and we'll figure it out. Yours to keep, assuming you don't lose it in a ravine.",
            "$2 parking. Bring water and shoes you can walk in."
        ],
        links: [
            ["course info", "https://www.delaveagadiscgolf.com/"],
            ["map", "https://www.google.com/maps/search/?api=1&query=DeLaveaga+Disc+Golf+Course"]
        ],
        lead: "Lead: open"
    },
    {
        id: "bike", n: 5, theme: "t-bike", icon: "bike", accent: "#0284C7",
        title: "Pacific Coast Bike Cruise",
        tag: "Rentals from Epicenter Cycling, a few blocks from the hotel.",
        badge: { text: "E-bikes available" },
        route: "Coast route · ocean views the whole way",
        chill: 40, chillLabel: "easy pedaling",
        tags: ["active"], cost: 3, drive: "walkable, no drive",
        pin: [604, 352], labelDx: -96, labelDy: -12,
        notes: [
            "The locals' pick. You cover more ground and see more of the area than anyone else.",
            "Ocean on one side the whole way, and you can stop whenever something looks worth stopping for.",
            "This road on a bike beats this road in a car. It isn't close.",
            "Try to keep up with Michael.",
            "E-bikes available if you'd rather not earn the hills.",
            "Reserve early. Small shop, and a weekday group of eight is a real ask.",
            "Helmets included. Wear something you don't mind sweating in."
        ],
        links: [["shop", "https://www.google.com/maps/search/?api=1&query=Epicenter+Cycling+Aptos"]],
        lead: "Lead: Michael"
    },
    {
        id: "hike", n: 6, theme: "t-forest", icon: "trees", accent: "#14532D",
        title: "Forest of Nisene Marks",
        tag: "Redwoods, real trail, five minutes from the hotel.",
        badge: { text: "[ 3.5 MI · SHADED TRAIL ]" },
        chill: 46, chillLabel: "mild hike",
        tags: ["active"], cost: 0, drive: "5 min drive",
        pin: [677, 84], labelDx: -176, labelDy: -12,
        notes: [
            "The last tree most of us dealt with was a dependency tree. These ones are taller.",
            "Redwoods, ferns, a creek, and about ten degrees cooler than everywhere else.",
            "The 1989 Loma Prieta earthquake started under this forest. The epicenter marker is further in than we're going.",
            "Nothing crazy. Steady pace, nobody racing, stop whenever you feel like it.",
            "Bring cash. Parking is a self-pay envelope, no attendant.",
            "No bookings, no rentals, nothing to buy. Just show up in decent shoes."
        ],
        links: [
            ["park info", "https://www.parks.ca.gov/?page_id=666"],
            ["map", "https://www.google.com/maps/search/?api=1&query=Forest+of+Nisene+Marks+State+Park"]
        ],
        lead: "Lead: Scott"
    }
];

/* ---------------- Wednesday, top to bottom ----------------
   tbd: true renders the row greyed out with a "to come" marker.
   pick: true is the afternoon row — it mirrors whatever you signed up for. */
const SCHEDULE = [
    { when: "12:00", title: "Lunch", detail: "Details to come.", tbd: true },
    {
        when: "~1:00 pm", title: "Groups head out",
        detail: "Sort drivers, seats, and who is riding with who before this. Not at 12:58."
    },
    {
        when: "Afternoon", title: "Your pick", pick: true,
        detail: "Whichever of the six you put your name on. Ends when it ends."
    },
    {
        when: "Until 8:00 pm", title: "Dinner with your group",
        detail: "Each group sorts its own plan, so talk it through on the way out."
    }
];

const HEADCOUNT = 50;
/* change this one string to move the deadline everywhere it appears */
const DEADLINE = "Fri 25 Sept";
/* the Apps Script /exec URL from Code.gs. Empty runs the page
   local-only, which is handy for editing copy offline. */
const ENDPOINT = "https://script.google.com/macros/s/AKfycbw-xIaO2vEHdPlXXRiR0CSQC2tDffqPqKHm3jhF8PU7o94JBs8HOze5RW7gtBXmq0_s/exec";
const ME_KEY = "aptos-offsite-me-v1";
const SESSION_ID = "a:" + Math.random().toString(36).slice(2, 10);

let signups = {};
let openActivity = null;
let lastFocus = null;
let filter = "all";
let me = loadMe();

const hasBackend = !!ENDPOINT;
const $ = id => document.getElementById(id);
const byId = id => ACTIVITIES.find(a => a.id === id);
const esc = s => String(s).replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

/* ---------------- who am I ---------------- */
function loadMe() {
    try { return JSON.parse(localStorage.getItem(ME_KEY) || "null"); }
    catch (e) { return null; }
}
function saveMe(v) {
    try { v ? localStorage.setItem(ME_KEY, JSON.stringify(v)) : localStorage.removeItem(ME_KEY); }
    catch (e) { /* private mode — the page still works, it just forgets you */ }
    me = v;
}
function findByKey(key) {
    if (!key) return null;
    for (const id in signups) {
        const hit = (signups[id] || []).find(p => p.key === key);
        if (hit) return { id, person: hit };
    }
    return null;
}
const myPick = () => findByKey(me && me.key);

/* ---------------- the sheet ---------------- */
async function pull() {
    if (!hasBackend) return;
    try {
        const res = await fetch(ENDPOINT, { cache: "no-store" });
        const data = await res.json();
        if (data && data.ok) signups = data.signups || {};
    } catch (e) { signups = signups || {}; }
}
/* text/plain keeps this a "simple" request. Apps Script has no doOptions,
   so anything that triggers a CORS preflight gets rejected before it runs.
   The reply carries the fresh roster, so a write costs one round trip. */
async function post(body) {
    if (!hasBackend) return true;
    try {
        const res = await fetch(ENDPOINT, {
            method: "POST",
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!data || !data.ok) return false;
        signups = data.signups || {};
        return true;
    } catch (e) { return false; }
}
async function load() {
    await pull();
    render();
    if (!load.booted) { load.booted = true; openFromHash(); }
}

/* ---------------- card markup ---------------- */
function costHTML(c) {
    if (c === 0) return '<span class="cost">free</span>';
    return '<span class="cost">' + "$".repeat(c) + '<span class="off">' + "$".repeat(3 - c) + "</span></span>";
}
function extrasHTML(a) {
    let html = "";
    if (a.badge) {
        html += '<span class="badge">' + (a.badge.icon ? ICON[a.badge.icon] : "") + esc(a.badge.text) + "</span>";
    }
    if (a.cottages) {
        html += '<div class="cottages" aria-hidden="true">' + a.cottages.map((c, i) =>
            '<i style="background:' + c + ';height:' + (12 + (i % 3) * 5) + 'px"></i>').join("") + "</div>";
    }
    if (a.stats) {
        html += '<div class="stats">' + a.stats.map(s =>
            '<div class="stat"><b>' + esc(s[0]) + "</b><span>" + esc(s[1]) + "</span></div>").join("") + "</div>";
    }
    if (a.route) {
        html += '<div class="route">' + ICON.wave + esc(a.route) + "</div>";
    }
    return html;
}
/* deliberately unthemed — the one element that reads the same on all six cards */
function gaugeHTML(a) {
    return '<div class="gauge">' +
        '<div class="gauge-h"><span>Chill factor</span><b>' + esc(a.chillLabel) + "</b></div>" +
        '<div class="gauge-track"><span class="gauge-dot" style="left:' + a.chill + '%"></span></div>' +
        '<div class="gauge-ends"><span>poolside lounging</span><span>running a marathon</span></div>' +
        "</div>";
}

function cardHTML(a) {
    return '<span class="flag">You\'re in</span>' +
        (a.id === "bike" ? '<span class="speedlines" aria-hidden="true"><i></i><i></i><i></i></span>' : "") +
        '<div class="card-head">' +
        '<span class="glyph" aria-hidden="true">' + ICON[a.icon] + "</span>" +
        '<span class="card-num">0' + a.n + "</span>" +
        '<button class="share" type="button" data-share="' + a.id + '" ' +
        'title="Copy a link straight to this one" aria-label="Copy link to ' + esc(a.title) + '">' +
        ICON.link + "</button>" +
        "</div>" +
        "<h2>" + esc(a.title) + "</h2>" +
        '<p class="tagline">' + esc(a.tag) + "</p>" +
        extrasHTML(a) +
        gaugeHTML(a) +
        '<div class="chips">' + costHTML(a.cost) +
        "<span>" + esc(a.drive) + "</span><span>" + esc(a.lead) + "</span></div>" +
        '<ul class="notes">' + a.notes.map(n => "<li>" + esc(n) + "</li>").join("") + "</ul>" +
        (a.links.length
            ? '<div class="links">' + a.links.map(l =>
                '<a href="' + l[1] + '" target="_blank" rel="noopener noreferrer">' + esc(l[0]) + ICON.ext + "</a>"
            ).join("") + "</div>"
            : "") +
        '<div class="card-foot">' +
        '<button class="join" type="button" data-id="' + a.id + '"></button>' +
        '<p class="swap-note"></p>' +
        '<div class="tally"></div>' +
        '<div class="roster"></div>' +
        '<div class="rnotes-slot"></div>' +
        "</div>";
}

function buildCards() {
    const grid = $("grid");
    ACTIVITIES.forEach(a => {
        const c = document.createElement("article");
        c.className = "card " + a.theme;
        c.id = "card-" + a.id;
        c.dataset.id = a.id;
        c.dataset.tags = a.tags.join(" ");
        c.innerHTML = cardHTML(a);
        c.addEventListener("mouseenter", () => lite(a.id, true));
        c.addEventListener("mouseleave", () => lite(a.id, false));
        grid.appendChild(c);
    });
    grid.addEventListener("click", e => {
        const join = e.target.closest("button.join");
        if (join) { openForm(join.dataset.id); return; }
        const share = e.target.closest("button.share");
        if (share) copyLink(share.dataset.share);
    });
}

/* ---------------- deep links ---------------- */
function cardURL(id) {
    return location.origin + location.pathname + location.search + "#card-" + id;
}
function copyLink(id) {
    const url = cardURL(id);
    const done = () => toast("Link copied. Send it to whoever you're recruiting.");
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, () => legacyCopy(url, done));
    } else {
        legacyCopy(url, done);
    }
}
function legacyCopy(text, done) {
    /* clipboard API needs a secure context, which file:// isn't */
    const box = document.createElement("textarea");
    box.value = text;
    box.setAttribute("readonly", "");
    box.style.cssText = "position:fixed;top:-999px;opacity:0";
    document.body.appendChild(box);
    box.select();
    try { document.execCommand("copy"); done(); }
    catch (e) { toast("Couldn't copy — the link is " + text); }
    document.body.removeChild(box);
}
function spotlight(id, ms) {
    const card = $("card-" + id);
    if (!card) return;
    applyFilter("all");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    lite(id, true);
    clearTimeout(spotlight["_" + id]);
    spotlight["_" + id] = setTimeout(() => lite(id, false), ms || 1600);
}
function openFromHash() {
    const m = (location.hash || "").match(/^#card-([a-z]+)$/i);
    if (m && byId(m[1])) spotlight(m[1], 2400);
}

/* ---------------- roster bits ---------------- */
function rosterHTML(id) {
    const list = signups[id] || [];
    if (!list.length) return '<span style="opacity:.6">nobody yet — be the first</span>';
    let anon = 0;
    const bits = [];
    list.forEach(p => {
        if (!p.name) { anon++; return; }
        let s = '<span class="who">' + esc(p.name);
        if (p.seats > 0) s += ICON.car + '<span class="seats">+' + p.seats + "</span>";
        if (p.canLead) s += '<span class="star" title="willing to lead">★</span>';
        bits.push(s + "</span>");
    });
    if (anon) bits.push('<span style="opacity:.7">' + anon + " anonymous</span>");
    return bits.join('<span class="sep">·</span>');
}
function notesHTML(id) {
    const list = (signups[id] || []).filter(p => p.note);
    if (!list.length) return "";
    return '<div class="rnotes">' + list.map(p =>
        "<span>“" + esc(p.note) + "” — " + (p.name ? esc(p.name) : "anon") + "</span>").join("") + "</div>";
}
function tallyHTML(id) {
    const list = signups[id] || [];
    const seats = list.reduce((s, p) => s + (p.seats || 0), 0);
    const leads = list.filter(p => p.canLead).length;
    return [
        list.length + (list.length === 1 ? " person" : " people"),
        seats + (seats === 1 ? " seat offered" : " seats offered"),
        leads ? leads + " willing to lead" : "no lead yet"
    ].join(" · ");
}

/* ---------------- render ---------------- */
function render() {
    const mine = myPick();
    let total = 0, seats = 0;
    const leadless = [];

    ACTIVITIES.forEach(a => {
        const list = signups[a.id] || [];
        total += list.length;
        seats += list.reduce((s, p) => s + (p.seats || 0), 0);
        if (a.lead === "Lead: open" && !list.some(p => p.canLead)) leadless.push(a.title);

        const card = $("card-" + a.id);
        const isMine = !!mine && mine.id === a.id;
        card.classList.toggle("mine", isMine);
        card.querySelector(".tally").textContent = tallyHTML(a.id);
        card.querySelector(".roster").innerHTML = rosterHTML(a.id);
        card.querySelector(".rnotes-slot").innerHTML = notesHTML(a.id);

        const btn = card.querySelector(".join");
        btn.innerHTML = isMine
            ? ICON.check + "You're in — edit or leave"
            : (mine ? ICON.swap + "Move me here" : ICON.plus + "Count me in");

        card.querySelector(".swap-note").textContent =
            mine && !isMine ? "Takes your name off " + byId(mine.id).title + "." : "";
    });

    $("schedulePick").textContent = mine
        ? "You're on " + byId(mine.id).title + ". Ends when it ends."
        : "Whichever of the six you put your name on. Ends when it ends.";

    $("grid").classList.toggle("picked", !!mine);
    $("pickHint").textContent = mine
        ? "You're down for " + byId(mine.id).title
        : "One pick per person · sign up by " + DEADLINE;

    $("rsvpCount").textContent = total;
    $("rsvpLeft").textContent = Math.max(0, HEADCOUNT - total) + " to go";

    /* the counter bar doubles as the live split — one segment per activity */
    const parts = [];
    $("rsvpTrack").innerHTML = ACTIVITIES.map(a => {
        const n = (signups[a.id] || []).length;
        if (!n) return "";
        parts.push(a.title + ": " + n);
        return '<i style="width:' + Math.min(100, (n / HEADCOUNT) * 100) +
            "%;background:" + a.accent + '"></i>';
    }).join("");
    $("rsvpTrack").parentNode.title = parts.length
        ? parts.join("\n")
        : "Nobody has picked yet";

    $("foot").innerHTML =
        total + " signed up · " + seats + " seats offered across all groups<br>" +
        "Sign up by " + DEADLINE + " so bikes can be reserved, discs ordered, and tables sized.<br>" +
        "One option per person. Signing up for another moves your name.<br>" +
        (leadless.length ? "Still needs a lead: " + esc(leadless.join(", ")) + "<br>" : "") +
        "Questions, or want to swap something → ping Ryan.<br>" +
        "Press 1–6 to jump between options.";
}

/* ---------------- filters ---------------- */
function applyFilter(next) {
    filter = next;
    document.querySelectorAll(".pill").forEach(p =>
        p.setAttribute("aria-pressed", String(p.dataset.filter === filter)));
    ACTIVITIES.forEach(a =>
        $("card-" + a.id).classList.toggle("hidden", filter !== "all" && a.tags.indexOf(filter) === -1));
}
function buildFilters() {
    document.querySelectorAll(".pill").forEach(p => {
        const f = p.dataset.filter;
        if (f !== "all") {
            p.querySelector(".n").textContent = ACTIVITIES.filter(a => a.tags.indexOf(f) > -1).length;
        }
        p.addEventListener("click", () => applyFilter(f));
    });
}

/* ---------------- schedule ---------------- */
function buildSchedule() {
    $("schedule").innerHTML = SCHEDULE.map(row =>
        '<li class="' + (row.pick ? "pick" : row.tbd ? "tbd" : "") + '">' +
        '<span class="when">' + esc(row.when) + "</span>" +
        '<div class="track"><b>' + esc(row.title) + (row.tbd ? '<i class="tbd-tag">to come</i>' : "") + "</b>" +
        (row.detail || row.pick
            ? '<span class="what"' + (row.pick ? ' id="schedulePick"' : "") + ">" + esc(row.detail || "") + "</span>"
            : "") +
        (row.pick ? '<a class="jump" href="#grid">Choose yours ↑</a>' : "") +
        "</div></li>"
    ).join("");
}

/* ---------------- decide for me ---------------- */
let spinning = false;
function pickForMe() {
    if (spinning || openActivity) return;
    const pool = ACTIVITIES.filter(a => filter === "all" || a.tags.indexOf(filter) > -1);
    const winner = pool[Math.floor(Math.random() * pool.length)];
    const land = () => {
        spinning = false;
        $("card-" + winner.id).scrollIntoView({ behavior: "smooth", block: "center" });
        lite(winner.id, true);
        setTimeout(() => { lite(winner.id, false); openForm(winner.id); }, 850);
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches || pool.length < 2) { land(); return; }

    spinning = true;
    $("pickForMe").disabled = true;
    let i = 0;
    const ticks = 11 + Math.floor(Math.random() * 7);
    const spin = setInterval(() => {
        pool.forEach(a => lite(a.id, false));
        lite(pool[i % pool.length].id, true);
        if (++i >= ticks) {
            clearInterval(spin);
            pool.forEach(a => lite(a.id, false));
            $("pickForMe").disabled = false;
            land();
        }
    }, 95);
}

/* ---------------- map pins ---------------- */
function buildPins() {
    const g = $("pins"), NS = "http://www.w3.org/2000/svg";
    ACTIVITIES.forEach(a => {
        const [x, y] = a.pin;
        const grp = document.createElementNS(NS, "g");
        grp.setAttribute("class", "pin");
        grp.setAttribute("style", "color:" + a.accent);
        grp.setAttribute("tabindex", "0");
        grp.setAttribute("role", "link");
        grp.setAttribute("aria-label", a.title);
        grp.id = "pin-" + a.id;
        grp.innerHTML =
            '<circle class="halo" cx="' + x + '" cy="' + y + '" r="22" fill="currentColor"/>' +
            '<circle class="head" cx="' + x + '" cy="' + y + '" r="12" stroke="currentColor"/>' +
            '<text class="num" x="' + x + '" y="' + (y + 4.5) + '">' + a.n + "</text>" +
            '<text class="lbl" x="' + (x + a.labelDx) + '" y="' + (y + a.labelDy) + '">' +
            esc(a.title.toUpperCase()) + "</text>";
        const go = () => {
            applyFilter("all");
            $("card-" + a.id).scrollIntoView({ behavior: "smooth", block: "center" });
            lite(a.id, true);
            setTimeout(() => lite(a.id, false), 1600);
        };
        grp.addEventListener("click", go);
        grp.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
        grp.addEventListener("mouseenter", () => lite(a.id, true));
        grp.addEventListener("mouseleave", () => lite(a.id, false));
        g.appendChild(grp);
    });
}
function lite(id, on) {
    const p = $("pin-" + id), c = $("card-" + id);
    if (p) p.classList.toggle("lit", on);
    if (c) c.classList.toggle("lit", on);
}

/* ---------------- modal ---------------- */
function syncModalButtons() {
    const typed = $("fName").value.trim();
    const key = $("fAnon").checked
        ? (me && me.anon ? me.key : SESSION_ID)
        : (typed ? "n:" + typed.toLowerCase() : null);
    const existing = findByKey(key);

    $("btnLeave").classList.toggle("on", !!existing);
    $("btnSave").textContent = existing && existing.id === openActivity ? "Update my details" :
        existing ? "Move me here" : "Sign me up";

    const moving = existing && existing.id !== openActivity;
    $("moving").classList.toggle("on", !!moving);
    if (moving) {
        $("movingText").innerHTML = "You're currently on <b>" + esc(byId(existing.id).title) +
            "</b>. Signing up here moves your name over.";
    }
}

function openForm(actId) {
    const a = byId(actId);
    const mine = myPick();
    openActivity = actId;
    lastFocus = document.activeElement;

    $("modalGlyph").innerHTML = ICON[a.icon];
    $("modalGlyph").setAttribute("style", "background:" + a.accent);
    $("modalTitle").textContent = a.title;
    $("modalSub").textContent = "Option 0" + a.n + " · " + a.drive;
    $("fErr").classList.remove("on");

    const prior = mine ? mine.person : null;
    const anon = !!(prior ? !prior.name : me && me.anon);
    $("fAnon").checked = anon;
    $("fName").value = prior && prior.name ? prior.name : (me && me.name) || "";
    $("fName").disabled = anon;
    $("fDrive").checked = !!(prior && prior.seats > 0);
    $("fSeats").value = prior && prior.seats > 0 ? prior.seats : 3;
    $("fSeats").disabled = !$("fDrive").checked;
    $("fLead").checked = !!(prior && prior.canLead);
    $("fNote").value = (prior && prior.note) || "";

    syncModalButtons();
    $("scrim").classList.add("on");
    setTimeout(() => ($("fAnon").checked ? $("fDrive") : $("fName")).focus(), 40);
}

function closeForm() {
    $("scrim").classList.remove("on");
    openActivity = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("on"), 3200);
}

async function save() {
    const anon = $("fAnon").checked;
    const name = $("fName").value.trim();
    if (!anon && !name) {
        $("fErr").textContent = "Add a name, or tick anonymous.";
        $("fErr").classList.add("on");
        $("fName").focus();
        return;
    }
    const key = anon ? (me && me.anon ? me.key : SESSION_ID) : "n:" + name.toLowerCase();
    const person = {
        key,
        name: anon ? null : name,
        seats: $("fDrive").checked ? Math.max(0, parseInt($("fSeats").value, 10) || 0) : 0,
        canLead: $("fLead").checked,
        note: $("fNote").value.trim().slice(0, 220) || null
    };
    const target = openActivity;

    await pull();
    for (const id in signups) signups[id] = (signups[id] || []).filter(p => p.key !== key);
    if (!signups[target]) signups[target] = [];
    signups[target].push(person);
    saveMe({ key, name: person.name, anon });

    closeForm();
    render();

    const ok = await post(Object.assign({ action: "save", activity: target }, person));
    if (!ok) { toast("Couldn't save — check your connection and try again."); return; }
    render();
    /* say so out loud when there's no backend, otherwise a stale cached
       copy of this file looks exactly like a successful save */
    toast(hasBackend
        ? "You're on " + byId(target).title + "."
        : "Local preview only — nothing was saved to the sheet.");
    $("card-" + target).scrollIntoView({ behavior: "smooth", block: "center" });
}

async function leave() {
    const anon = $("fAnon").checked;
    const name = $("fName").value.trim();
    const key = anon ? (me && me.anon ? me.key : SESSION_ID) : "n:" + name.toLowerCase();
    if (!anon && !name) {
        $("fErr").textContent = "Type the name you signed up with so I know which one to remove.";
        $("fErr").classList.add("on");
        return;
    }
    await pull();
    for (const id in signups) signups[id] = (signups[id] || []).filter(p => p.key !== key);
    if (me && me.key === key) saveMe(null);

    closeForm();
    render();
    const ok = await post({ action: "leave", key: key, name: name || null });
    render();
    if (!ok) { toast("Couldn't reach the sheet — your name may still be on it."); return; }
    toast(hasBackend
        ? "Name removed. Pick another whenever."
        : "Local preview only — nothing was saved to the sheet.");
}

/* ---------------- boot ---------------- */
$("deadlineChip").textContent = DEADLINE;
buildCards();
buildFilters();
buildSchedule();
buildPins();

$("btnSave").addEventListener("click", save);
$("btnCancel").addEventListener("click", closeForm);
$("btnLeave").addEventListener("click", leave);
$("scrim").addEventListener("click", e => { if (e.target === $("scrim")) closeForm(); });
$("pickForMe").addEventListener("click", pickForMe);
addEventListener("hashchange", openFromHash);

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && openActivity) { closeForm(); return; }
    if (openActivity || spinning || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= ACTIVITIES.length) spotlight(ACTIVITIES[n - 1].id, 1500);
});

$("fAnon").addEventListener("change", () => {
    $("fName").disabled = $("fAnon").checked;
    if ($("fAnon").checked) $("fName").value = "";
    syncModalButtons();
});
$("fDrive").addEventListener("change", () => {
    $("fSeats").disabled = !$("fDrive").checked;
    if ($("fDrive").checked) $("fSeats").focus();
});
$("fName").addEventListener("input", syncModalButtons);

const topbar = $("topbar");
addEventListener("scroll", () => topbar.classList.toggle("stuck", scrollY > 8), { passive: true });
addEventListener("focus", () => { if (hasBackend && !openActivity) load(); });

load();
