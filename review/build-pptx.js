const pptxgen = require("pptxgenjs");
const { applyTheme } = require("C:/Users/Ankush Hegde/AppData/Roaming/Claude/local-agent-mode-sessions/skills-plugin/faf90785-4d0f-4442-8224-f5a71e373156/44a68c69-d6d7-4dce-a346-24ea8a1eeba8/skills/pptx/scripts/apply_theme.js");

const OUT = process.argv[2] || "Broadway-Website-Review.pptx";

const THEME = {
  name: "Broadway Review",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "0B1F44", lt1: "FFFFFF", dk2: "3D4C63", lt2: "F5F8FC",
    accent1: "1A56DB", accent2: "C2410C", accent3: "12306A", accent4: "8FB4FF",
    accent5: "EAF0FA", accent6: "5B6B82", hlink: "1A56DB", folHlink: "12306A",
  },
};

// Hex constants (mirror THEME) for shape fills and lines
const NAVY = "0B1F44", NAVY2 = "12306A", BLUE = "1A56DB", ORANGE = "C2410C";
const LIGHT = "F5F8FC", WHITE = "FFFFFF", BODY = "3D4C63", MUTED = "5B6B82";
const LINE = "D5DEEB", TINT = "EAF0FA", SKY = "8FB4FF", PALE = "C9D8F5";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Broadway Website Review";
pres.author = "Website review";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

const W = 13.333, M = 0.6, CW = W - 2 * M;
const FOOT = "Broadway Communication · Website review";

pres.defineSlideMaster({
  title: "Cover",
  background: { color: NAVY },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.3, w: 11, h: 1.4, fontSize: 60, bold: true, color: WHITE, align: "left", valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 3.9, w: 9.5, h: 1.2, fontSize: 22, color: PALE, align: "left", valign: "top", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "Content",
  background: { color: LIGHT },
  margin: [0.6, 0.6, 0.9, 0.6],
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.45, w: CW, h: 1.0, fontSize: 30, bold: true, color: NAVY, align: "left", valign: "top", margin: 0 }, text: "" } },
    { text: { text: FOOT, options: { x: M, y: 6.95, w: 8, h: 0.35, fontSize: 11, color: MUTED, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.6, y: 6.95, w: 0.6, h: 0.35, fontSize: 11, color: MUTED, align: "right" },
});

pres.defineSlideMaster({
  title: "Content Dark",
  background: { color: NAVY },
  margin: [0.6, 0.6, 0.9, 0.6],
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.45, w: CW, h: 1.0, fontSize: 30, bold: true, color: WHITE, align: "left", valign: "top", margin: 0 }, text: "" } },
    { text: { text: FOOT, options: { x: M, y: 6.95, w: 8, h: 0.35, fontSize: 11, color: SKY, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.6, y: 6.95, w: 0.6, h: 0.35, fontSize: 11, color: SKY, align: "right" },
});

const TOP = 1.65; // content top
const BOTTOM = 6.7;

function kicker(slide, text, color) {
  slide.addText(text.toUpperCase(), { x: M, y: 0.18, w: CW, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, color: color || BLUE, margin: 0, isTextBox: true, objectName: "Kicker" });
}

function card(slide, x, y, w, h, title, body, opts = {}) {
  const dark = !!opts.dark;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.12,
    fill: { color: dark ? NAVY2 : WHITE },
    line: dark ? { type: "none" } : { color: LINE, width: 0.75 },
    objectName: "Card " + title,
  });
  slide.addText([
    { text: title, options: { fontSize: opts.titleSize || 18, bold: true, color: dark ? WHITE : NAVY, breakLine: true } },
    { text: body, options: { fontSize: opts.bodySize || 15, color: dark ? PALE : BODY, paraSpaceBefore: 6 } },
  ], { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: h - 0.4, valign: "top", margin: 0, isTextBox: true, objectName: "Card text " + title });
}

function grid(slide, items, cols, opts = {}) {
  const gap = 0.3;
  const rows = Math.ceil(items.length / cols);
  const top = opts.top || TOP;
  const avail = (opts.bottom || BOTTOM) - top;
  const cw = (CW - gap * (cols - 1)) / cols;
  const ch = Math.min(opts.maxH || 2.1, (avail - gap * (rows - 1)) / rows);
  items.forEach(([t, b], i) => {
    const r = Math.floor(i / cols), c = i % cols;
    card(slide, M + c * (cw + gap), top + r * (ch + gap), cw, ch, t, b, opts);
  });
}

function table(slide, header, rows, colW, opts = {}) {
  const fs = opts.fontSize || 13;
  const data = [header.map((h) => ({ text: h, options: { bold: true, color: MUTED, fill: { color: TINT }, fontSize: fs - 1 } }))];
  rows.forEach((r, i) => {
    data.push(r.map((cell) => {
      const c = typeof cell === "string" ? { text: cell } : cell;
      return { text: c.text, options: { fontSize: fs, color: c.color || NAVY, bold: !!c.bold, fill: { color: i % 2 ? TINT : WHITE } } };
    }));
  });
  slide.addTable(data, {
    x: M, y: opts.top || TOP, w: CW, colW,
    border: { type: "solid", color: LINE, pt: 0.75 },
    fontFace: "Calibri", valign: "middle", margin: [0.06, 0.12, 0.06, 0.12],
    objectName: opts.name || "Table",
  });
}

function slide(master, section, title) {
  const s = pres.addSlide({ masterName: master, sectionTitle: section });
  s.addText(title, { placeholder: "title" });
  return s;
}

// ---------- Section 1 ----------
pres.addSection({ title: "Summary" });

let s = pres.addSlide({ masterName: "Cover", sectionTitle: "Summary" });
s.addText("BROADWAY COMMUNICATION PVT. LTD.", { x: M, y: 1.6, w: 9, h: 0.4, fontSize: 14, bold: true, charSpacing: 3, color: SKY, margin: 0, isTextBox: true, objectName: "Cover kicker" });
s.addText("Website review", { placeholder: "title" });
s.addText("The current live demo and the new build, assessed for UI/UX, flow and marketing impact.", { placeholder: "body" });
s.addText("UI/UX and marketing assessment   ·   October 2026", { x: M, y: 6.4, w: 9, h: 0.4, fontSize: 14, color: PALE, margin: 0, isTextBox: true, objectName: "Cover meta" });
s.addNotes("Introduce the purpose: we looked at the current live demo site and the new build side by side. The goal is to show what is not right in the current site, what we developed, and why those changes matter for the business.");

s = slide("Content", "Summary", "The new build is a much stronger brand. It still needs the sales basics");
kicker(s, "The verdict");
[["LIVE DEMO TODAY", "6.0", "Template look, forms not connected", false], ["NEW BUILD", "7.5", "Premium brand, missing pricing and calls", true]].forEach(([lab, num, note, hi], i) => {
  const x = M + i * 4.3, y = 2.2, w = 4.0, h = 3.6;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: WHITE }, line: { color: hi ? BLUE : LINE, width: hi ? 2 : 0.75 }, objectName: "Score card " + lab });
  s.addText([
    { text: lab, options: { fontSize: 13, bold: true, charSpacing: 2, color: hi ? BLUE : MUTED, breakLine: true } },
    { text: num, options: { fontSize: 80, bold: true, color: hi ? BLUE : MUTED, breakLine: true } },
    { text: note, options: { fontSize: 16, color: BODY } },
  ], { x: x + 0.3, y: y + 0.3, w: w - 0.6, h: h - 0.6, valign: "top", margin: 0, isTextBox: true, objectName: "Score text " + lab });
});
s.addText("Overall score out of 10, reviewer judgement", { x: M + 8.8, y: 2.2, w: 3.3, h: 1.2, fontSize: 14, color: MUTED, italic: true, margin: 0, isTextBox: true, objectName: "Score note" });
s.addNotes("Lead with the headline. The new build looks like an established infrastructure company; the live demo looks like a template. But the new build has dropped pricing, click-to-call and WhatsApp, which home buyers rely on. Overall: 6 for the current site, 7.5 for the new build.");

s = slide("Content", "Summary", "Two sites, one method");
kicker(s, "What we reviewed");
grid(s, [
  ["Live demo", "codemythought.in/demo/broadway. PHP site on a bought jQuery theme. Homepage plus 15 inner pages."],
  ["New build", "Full-screen home page built from scratch in React, Vite, Tailwind and GSAP. Run locally for the review."],
  ["Method", "Desktop and mobile walkthroughs, code and load checks, plus UX heuristic, anti-pattern and six-pillar audits."],
], 3, { maxH: 2.4, top: 2.0 });
s.addNotes("Explain the method so the scores are credible: we tested both sites at a laptop width and a phone width, inspected the page code, checked every link and form, measured load time, and ran three structured design audits on the new build.");

// ---------- Section 2 ----------
pres.addSection({ title: "Live demo" });

s = slide("Content", "Live demo", "What the current site gets right");
kicker(s, "Live demo · strengths");
grid(s, [
  ["Prices on the page", "₹299, ₹599 and ₹1,099 plans, with the 100 Mbps plan marked Popular."],
  ["Easy to call", "Click-to-call 951 313 1177 throughout, plus a WhatsApp button."],
  ["Availability check", "PIN code and building form for home buyers."],
  ["Clear local positioning", "\"Local team, not a distant call centre\" is the right angle against national ISPs."],
], 2);
s.addNotes("Start fair: the current site does several sales basics well. Prices are visible, calling is one tap, there is a PIN availability form, and the local-team positioning is right.");

s = slide("Content", "Live demo", "Five problems that cost leads today");
kicker(s, "Live demo · critical issues", ORANGE);
table(s, ["Issue", "What we found", "Impact"], [
  [{ text: "Forms go nowhere", bold: true }, "Both forms post to \"#\"", "Every enquiry is lost"],
  [{ text: "Mobile hero typo", bold: true }, "\"Fiberfor\" on phones", "First impression looks broken"],
  [{ text: "Slow first load", bold: true }, "About 11 s, 99 requests, 1.7 MB", "Visitors leave before the hero"],
  [{ text: "Hidden content", bold: true }, "Sections blank until animation runs", "Empty screens on fast scroll"],
  [{ text: "Dead social icons", bold: true }, "Facebook, Instagram, LinkedIn, YouTube link to \"#\"", "Looks unfinished"],
], [3.2, 5.4, 3.53], { fontSize: 17 });
s.addNotes("The most serious problem: both forms on the live demo submit to a hash link, so no enquiry reaches anyone. The 11-second load was measured on a first visit in our test; cached visits were fast. The other three are quick fixes but they hurt trust.");

s = slide("Content", "Live demo", "The order works against the buyer");
kicker(s, "Live demo · page flow", ORANGE);
grid(s, [
  ["Three hero messages", "The carousel rotates CCTV, leased lines and fiber. Each visitor sees a different pitch."],
  ["Prices buried", "Plans start about 2,800px down, below eight large service cards."],
  ["Proof comes last", "Testimonials sit after the forms, and they are anonymous."],
  ["Long on mobile", "About 13,600px, roughly 17 screens, with no sticky call bar."],
], 2);
s.addNotes("Beyond the bugs, the page order is wrong for a home broadband buyer. Price is their first question and it is buried. Trust should come before the ask, but testimonials come after the forms. On phones the page is about 17 screens long.");

// ---------- Section 3 ----------
pres.addSection({ title: "New build" });

s = slide("Content Dark", "New build", "Rebuilt from scratch around one story");
kicker(s, "New build · what was done", SKY);
grid(s, [
  ["City hero", "Full-screen connected Bengaluru, services rising from the rooftops."],
  ["One message", "\"Connecting lives. Powering possibilities.\" with two clear actions."],
  ["Six service families", "Internet, networks, security, voice, IT and entertainment."],
  ["Who we serve", "Homes, apartments, businesses and campuses each get their own story."],
  ["Delivery process", "Survey, design, install, support: how the work happens."],
  ["Pre-filled enquiry", "Every button fills in the chosen service and audience."],
], 3, { dark: true });
s.addNotes("Walk through the six changes. It is a custom build on React, Vite and GSAP, not a reskinned theme. The hero shows one network connecting the city. Services are grouped into six families. Each audience has its own section. A four-step delivery process shows how Broadway works. Every call to action pre-fills the enquiry form. It also adds accessibility support: keyboard navigation, reduced motion and proper image descriptions.");

s = slide("Content", "New build", "Buyers judge the vendor by the website");
kicker(s, "New build · why it was needed");
grid(s, [
  ["Credibility with enterprise", "IT parks, hospitals and campuses read a template site as a small operator."],
  ["A message people remember", "One story replaces three rotating slides that competed for attention."],
  ["Show the real advantage", "\"One local partner for everything\" is now shown as one network, not a product list."],
  ["Room to grow", "A modern codebase makes new pages, offers and locality pages quick to add."],
], 2);
s.addNotes("Why the rebuild was worth doing. Enterprise buyers judge competence by the website. The old hero split attention three ways. Broadway's real edge is one local team for everything, and the new hero shows that visually. The old jQuery theme with 26 plugins was slow and hard to change; the new codebase makes future pages quick to add.");

// ---------- Section 4 ----------
pres.addSection({ title: "Comparison" });

s = slide("Content", "Comparison", "Where the new build moves ahead");
kicker(s, "Side by side");
const B = (t) => ({ text: t, color: BLUE, bold: true });
table(s, ["Area", "Live demo", "New build", "Result"], [
  [{ text: "First impression", bold: true }, "3 rotating messages", "One city hero, one message", B("Better")],
  [{ text: "Brand feel", bold: true }, "Reskinned template", "Custom design and wordmark", B("Much better")],
  [{ text: "Audiences", bold: true }, "Home / Business, then ignored", "Four tailored sections", B("Much better")],
  [{ text: "Process", bold: true }, "Not shown", "Survey, design, install, support", B("New")],
  [{ text: "Enquiry form", bold: true }, "Submits nowhere, no feedback", "Pre-filled, confirmation shown", B("Better")],
  [{ text: "Accessibility", bold: true }, "Many gaps", "Keyboard, ARIA, reduced motion", B("Much better")],
  [{ text: "Technology", bold: true }, "jQuery theme, 26 plugins", "React and Vite, WebP images", B("Better")],
  [{ text: "Link previews", bold: true }, "No Open Graph tags", "Open Graph and Twitter tags", B("Better")],
], [2.6, 3.9, 3.9, 1.73], { fontSize: 16 });
s.addNotes("Where the new build moves ahead of the current site: a single clear first impression, a custom brand look, tailored sections for each audience, a visible delivery process, a friendlier enquiry form, real accessibility support, a modern technology base, and proper link previews when the site is shared on WhatsApp or LinkedIn.");

s = slide("Content", "Comparison", "Home-buyer conversion is the gap");
kicker(s, "Scorecard");
const cats = ["Visual design and brand", "Storytelling and flow", "Conversion: home buyer", "Conversion: enterprise", "Trust and proof", "Performance", "Accessibility", "Overall"];
s.addChart(pres.charts.BAR, [
  { name: "Live demo", labels: cats, values: [6.5, 5.5, 5.0, 5.0, 4.0, 4.0, 4.0, 6.0] },
  { name: "New build", labels: cats, values: [9.0, 8.0, 3.5, 7.5, 5.0, 6.0, 8.5, 7.5] },
], {
  x: M, y: TOP, w: CW, h: 5.1, barDir: "bar", barGrouping: "clustered", barGapWidthPct: 60,
  chartColors: ["9AA8BC", BLUE], catAxisOrientation: "maxMin",
  valAxisMinVal: 0, valAxisMaxVal: 10, valAxisMajorUnit: 2,
  catAxisLabelColor: NAVY, valAxisLabelColor: MUTED, catAxisLabelFontSize: 13, valAxisLabelFontSize: 11,
  catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
  valGridLine: { color: LINE, size: 0.75 }, catGridLine: { style: "none" },
  showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0", dataLabelFontSize: 11, dataLabelColor: NAVY, dataLabelFontFace: "+mn-lt",
  showLegend: true, legendPos: "t", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: NAVY,
  showTitle: true, title: "Score out of 10, live demo vs new build", titleFontSize: 14, titleColor: NAVY, titleFontFace: "+mn-lt",
  objectName: "Scorecard chart",
});
s.addNotes("Every area improves except home-buyer conversion, which drops from 5 to 3.5 because pricing, calling and the PIN check are gone. Performance would rise to about 8.5 once one unused 7.9 MB image is removed. These scores are our expert judgement, not analytics data.");

// ---------- Section 5 ----------
pres.addSection({ title: "Design audits" });

s = slide("Content Dark", "Design audits", "Three audits agree: a strong base with clear gaps");
kicker(s, "New build · structured audits", SKY);
[["UX heuristics", "20", "/40", "Acceptable. Weakest: help and efficiency (no phone, FAQ or quick route to contact)."],
 ["Technical audit", "9", "/20", "Poor. Responsive is good; colour tokens and visual clichés score lowest."],
 ["Visual pillars", "17", "/24", "Good. Typography is the weakest pillar (2/4); the other five score 3/4."]].forEach(([lab, n, d, note], i) => {
  const cw = (CW - 0.6) / 3, x = M + i * (cw + 0.3), y = 1.9, h = 3.6;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h, rectRadius: 0.12, fill: { color: NAVY2 }, line: { type: "none" }, objectName: "Audit card " + lab });
  s.addText([
    { text: lab, options: { fontSize: 15, bold: true, color: SKY, breakLine: true } },
    { text: n, options: { fontSize: 66, bold: true, color: WHITE } },
    { text: d, options: { fontSize: 26, bold: true, color: "8FA3C4", breakLine: true } },
    { text: note, options: { fontSize: 15, color: PALE } },
  ], { x: x + 0.3, y: y + 0.25, w: cw - 0.6, h: h - 0.5, valign: "top", margin: 0, isTextBox: true, objectName: "Audit text " + lab });
});
s.addText("Methods: Nielsen's 10 heuristics, an automated anti-pattern scan with in-browser overlay, and a six-pillar code audit against the project's own design brief.", { x: M, y: 5.8, w: CW, h: 0.7, fontSize: 14, color: PALE, margin: 0, isTextBox: true, objectName: "Audit methods" });
s.addNotes("We ran three structured audits on the new build. The UX heuristic review scored 20 out of 40: acceptable, but help and efficiency are weak because there is no phone number, FAQ or quick way to get in touch. The technical audit scored 9 out of 20: responsive layout is good, but colours are hard-coded and several visual clichés were flagged. The six-pillar visual review scored 17 out of 24, with typography the weakest.");

s = slide("Content", "Design audits", "Five design fixes");
kicker(s, "What the audits agree on", ORANGE);
const P = (t, c) => ({ text: t, color: c, bold: true });
table(s, ["Level", "Finding", "Evidence and fix"], [
  [P("P0", ORANGE), { text: "No real way to make contact", bold: true }, "Demo-only form, placeholder phone, no call or WhatsApp. Wire the form; add real contact links."],
  [P("P1", ORANGE), { text: "Look drifts into the brief's \"avoid\" list", bold: true }, "Cyan glow (93 hits), glass blur (19 uses), gradient footer wordmark, a label above every section."],
  [P("P1", ORANGE), { text: "Scroll is taken over", bold: true }, "Hero blocks wheel and touch for 1.8 s; pinned scenes make the page about 14,900px."],
  [P("P1", ORANGE), { text: "Text contrast below AA", bold: true }, "Hero intro line (blue on sky) and form note (4.0:1, needs 4.5:1)."],
  [P("P2", BLUE), { text: "No type or colour system", bold: true }, "48 font sizes, 8 weights, text down to 11px; brand blue hard-coded 38 times. Set 6 sizes, 3 weights, colour tokens."],
], [1.0, 3.6, 7.53], { fontSize: 15 });
s.addText("P0 blocks launch · P1 fix before release · P2 next pass", { x: M, y: 6.3, w: CW, h: 0.35, fontSize: 12, color: MUTED, italic: true, margin: 0, isTextBox: true, objectName: "Severity key" });
s.addNotes("The audits converge on five issues. P0: there is no working way to contact Broadway. P1: the visual style drifts into what the project's own design brief says to avoid, namely dark cyberpunk glow and excessive glass. P1: the hero takes over scrolling, and the page is very long. P1: two pieces of text fail WCAG AA contrast. P2: there is no type or colour system. The body font is Inter, flagged as overused; Broadway's own Manrope could carry both headings and body.");

// ---------- Section 6 ----------
pres.addSection({ title: "Next steps" });

s = slide("Content", "Next steps", "Six fixes before the client sees it");
kicker(s, "New build · fix before launch", ORANGE);
table(s, ["Fix", "Detail"], [
  [{ text: "Real contact details", bold: true }, "Replace placeholder address, \"+91 80 4000 BROADWAY\" and the .com email with Yelahanka 560064, 951 313 1177, support@broadwaycommunication.net"],
  [{ text: "Verify claims", bold: true }, "\"Licensed ISP\", \"TRAI/DoT compliant\", \"24/7 NOC\", \"Wi-Fi 6\", \"Est. 2000\": confirm or remove"],
  [{ text: "Remove 7.9 MB preload", bold: true }, "An unused image loads on every visit; costs seconds on 4G"],
  [{ text: "Broken Support link", bold: true }, "Header and footer point at a section not on the home page"],
  [{ text: "Ease the scroll lock", bold: true }, "Hero blocks scrolling during a 1.8 s glide; make it shorter or skippable"],
  [{ text: "Shorten the page", bold: true }, "About 14,900px; the service ring alone is about 3,800px"],
], [3.2, 8.93], { fontSize: 15 });
s.addNotes("Be upfront about these. The first two are the most important: the new build shows a placeholder address, phone number and email, and several compliance and capability claims that the client must confirm. The 7.9 MB image is a one-line fix in index.html. The Support link points to a section only on the About page.");

s = slide("Content", "Next steps", "Bring back what home buyers use");
kicker(s, "Carry over from the live demo");
grid(s, [
  ["Plans and prices", "Plus GST, installation, router, data limits and OTT apps."],
  ["PIN check up top", "The first action a home buyer wants to take."],
  ["Call and WhatsApp", "In the header, and as a sticky bar on mobile."],
  ["FAQ", "Install time, router, leased line versus home plan."],
  ["Real address", "Yelahanka office and the list of areas served."],
  ["Two CTA labels", "\"Check availability\" for homes, \"Get a quote\" for business."],
], 3);
s.addNotes("The live demo got these right and the new build should keep them. Most Indian ISP leads come by phone and WhatsApp, so a sticky call bar on mobile matters more than any animation. Prices with the fine print answer the first question a home buyer has.");

s = slide("Content", "Next steps", "Three weeks to a site that sells");
kicker(s, "Plan");
[["WEEK 1 · MUST FIX", ORANGE, ["Connect forms to email or CRM", "Thank-you page and tracking", "Real contacts, verified claims", "Remove 7.9 MB preload", "Fix Support link"]],
 ["WEEK 2 · CONVERSION", BLUE, ["Plans with fine print", "PIN availability check", "Sticky Call and WhatsApp bar", "Shorter scroll, no input lock", "Fix contrast; quieter glow and glass"]],
 ["WEEK 3 · TRUST AND SEO", NAVY, ["Named testimonials, Google reviews", "Client and RWA logos, real numbers", "Type scale and colour tokens", "Business schema and map", "Locality landing pages", "Pay bill and support entry"]]].forEach(([lab, col, items], i) => {
  const cw = (CW - 0.6) / 3, x = M + i * (cw + 0.3), y = TOP, h = 4.0;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h, rectRadius: 0.12, fill: { color: WHITE }, line: { color: LINE, width: 0.75 }, objectName: "Week card " + (i + 1) });
  s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.3, w: 0.5, h: 0.5, fill: { color: col }, line: { type: "none" }, objectName: "Week badge " + (i + 1) });
  s.addText(String(i + 1), { x: x + 0.3, y: y + 0.3, w: 0.5, h: 0.5, fontSize: 18, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Week number " + (i + 1) });
  s.addText(lab, { x: x + 0.95, y: y + 0.3, w: cw - 1.2, h: 0.5, fontSize: 14, bold: true, charSpacing: 1, color: col, valign: "middle", margin: 0, isTextBox: true, objectName: "Week label " + (i + 1) });
  s.addText(items.map((t, j) => ({ text: t, options: { bullet: true, breakLine: j < items.length - 1, paraSpaceAfter: 6 } })), { x: x + 0.3, y: y + 1.05, w: cw - 0.6, h: h - 1.3, fontSize: 15, color: BODY, valign: "top", margin: 0, isTextBox: true, objectName: "Week items " + (i + 1) });
});
s.addNotes("Week one makes the site safe to launch: leads arrive, contact details are real, and the heavy image is gone. Week two adds the home-buyer sales layer and the design fixes. Week three builds trust and local search: real testimonials, logos, a type and colour system, business schema, a map, locality pages, and a path for existing customers to pay or raise a ticket.");

s = pres.addSlide({ masterName: "Cover", sectionTitle: "Next steps" });
s.addText("IN ONE LINE", { x: M, y: 1.6, w: 9, h: 0.4, fontSize: 14, bold: true, charSpacing: 3, color: SKY, margin: 0, isTextBox: true, objectName: "Close kicker" });
s.addText("We rebuilt the brand to match Broadway's standing. Next, we make it sell.", { x: M, y: 2.2, w: 11.5, h: 1.8, fontSize: 40, bold: true, color: WHITE, valign: "top", margin: 0, isTextBox: true, objectName: "Close line" });
s.addText("Add plans, the PIN check, call and WhatsApp, and connect the forms, so every visit can turn into an enquiry.", { x: M, y: 4.2, w: 10, h: 1.0, fontSize: 22, color: PALE, valign: "top", margin: 0, isTextBox: true, objectName: "Close support" });
s.addNotes("Close on the pitch line. The new build fixes how Broadway looks and tells its story. The three-week plan adds the sales layer and wires up lead capture. Ask for sign-off on week one, starting with the real contact details and confirmation of the claims on the site.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
