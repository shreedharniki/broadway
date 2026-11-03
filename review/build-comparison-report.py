from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(r"C:\Users\Ankush Hegde\Desktop\Coding\Broadway\Full Screen Home Web")
OUT = ROOT / "deliverables" / "Broadway_Website_Comparison_Report_2026-10-15.docx"

NAVY = "17365D"
BLUE = "2F66B0"
PALE_BLUE = "EEF4FB"
PALE_GRAY = "F5F7FA"
MID_GRAY = "666666"
LINE = "D9D9D9"
BLACK = RGBColor(0, 0, 0)


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_row_cant_split(row):
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = OxmlElement("w:cantSplit")
    tr_pr.append(cant_split)


def shade_cell(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=110, start=120, bottom=110, end=120):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{margin}"))
        if node is None:
            node = OxmlElement(f"w:{margin}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color=LINE, size="6"):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.find(qn("w:tblBorders"))
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = f"w:{edge}"
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), size)
        element.set(qn("w:space"), "0")
        element.set(qn("w:color"), color)


def set_cell_width(cell, inches):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_w = tc_pr.find(qn("w:tcW"))
    if tc_w is None:
        tc_w = OxmlElement("w:tcW")
        tc_pr.append(tc_w)
    tc_w.set(qn("w:w"), str(int(inches * 1440)))
    tc_w.set(qn("w:type"), "dxa")


def set_font(run, name="Aptos", size=None, bold=None, color=None):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if color is not None:
        run.font.color.rgb = RGBColor.from_string(color)


def add_bullet(doc, text, level=0):
    style = "List Bullet" if level == 0 else "List Bullet 2"
    p = doc.add_paragraph(style=style)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.12
    p.add_run(text)
    return p


def add_number(doc, text):
    p = doc.add_paragraph(style="List Number")
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.12
    p.add_run(text)
    return p


def add_body(doc, text, bold_lead=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.14
    if bold_lead and text.startswith(bold_lead):
        p.add_run(bold_lead).bold = True
        p.add_run(text[len(bold_lead):])
    else:
        p.add_run(text)
    return p


def add_heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    p.paragraph_format.keep_with_next = True
    return p


def add_table(doc, headers, rows, widths, font_size=9.5):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table)
    header = table.rows[0]
    set_repeat_table_header(header)
    set_row_cant_split(header)
    for i, text in enumerate(headers):
        cell = header.cells[i]
        set_cell_width(cell, widths[i])
        set_cell_margins(cell)
        shade_cell(cell, NAVY)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(text)
        set_font(r, size=9.5, bold=True, color="FFFFFF")
    for row_index, row_values in enumerate(rows):
        row = table.add_row()
        set_row_cant_split(row)
        fill = "FFFFFF" if row_index % 2 == 0 else PALE_BLUE
        for i, text in enumerate(row_values):
            cell = row.cells[i]
            set_cell_width(cell, widths[i])
            set_cell_margins(cell)
            shade_cell(cell, fill)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            r = p.add_run(text)
            set_font(r, size=font_size, color="000000")
            if i == 0:
                r.bold = True
    after = doc.add_paragraph()
    after.paragraph_format.space_after = Pt(2)
    return table


def add_score_table(doc):
    table = doc.add_table(rows=2, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table)
    widths = [2.2, 2.2, 2.2]
    headers = ["Current website", "Proposed redesign", "Recommendation"]
    values = ["6.0 / 10\nUseful sales basics, weak brand and broken lead handling",
              "7.5 / 10\nStronger brand and journey, incomplete conversion layer",
              "Proceed after fixes\nRetain the redesign and restore practical buying routes"]
    for i, text in enumerate(headers):
        cell = table.rows[0].cells[i]
        set_cell_width(cell, widths[i])
        set_cell_margins(cell, top=140, bottom=100)
        shade_cell(cell, NAVY if i != 1 else BLUE)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        set_font(r, size=10, bold=True, color="FFFFFF")
    set_row_cant_split(table.rows[0])
    for i, text in enumerate(values):
        cell = table.rows[1].cells[i]
        set_cell_width(cell, widths[i])
        set_cell_margins(cell, top=140, bottom=140)
        shade_cell(cell, "FFFFFF" if i != 1 else PALE_BLUE)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        lines = text.split("\n")
        r = p.add_run(lines[0])
        set_font(r, size=17 if i < 2 else 12, bold=True, color=NAVY)
        r.add_break()
        r2 = p.add_run(lines[1])
        set_font(r2, size=9, color=MID_GRAY)
    set_row_cant_split(table.rows[1])
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


doc = Document()
section = doc.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(0.7)
section.bottom_margin = Inches(0.7)
section.left_margin = Inches(0.8)
section.right_margin = Inches(0.8)

styles = doc.styles
styles["Normal"].font.name = "Aptos"
styles["Normal"]._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
styles["Normal"]._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")
styles["Normal"].font.size = Pt(10.5)
styles["Normal"].font.color.rgb = BLACK

title_style = styles["Title"]
title_style.font.name = "Aptos Display"
title_style._element.rPr.rFonts.set(qn("w:ascii"), "Aptos Display")
title_style._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos Display")
title_style.font.size = Pt(30)
title_style.font.bold = True
title_style.font.color.rgb = BLACK

for style_name, size in (("Heading 1", 18), ("Heading 2", 13), ("Heading 3", 11)):
    style = styles[style_name]
    style.font.name = "Aptos Display"
    style._element.rPr.rFonts.set(qn("w:ascii"), "Aptos Display")
    style._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos Display")
    style.font.size = Pt(size)
    style.font.bold = True
    style.font.color.rgb = BLACK
    style.paragraph_format.space_before = Pt(14 if style_name == "Heading 1" else 10)
    style.paragraph_format.space_after = Pt(6)

for list_style in ("List Bullet", "List Bullet 2", "List Number"):
    styles[list_style].font.name = "Aptos"
    styles[list_style].font.size = Pt(10.5)

# Cover page
p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(34)
p.paragraph_format.space_after = Pt(10)
r = p.add_run("BROADWAY COMMUNICATION PVT LTD")
set_font(r, size=10, bold=True, color=BLUE)

p = doc.add_paragraph(style="Title")
p.paragraph_format.space_after = Pt(12)
p.add_run("Broadway Website Comparison Report")

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(28)
r = p.add_run("Current public website and proposed redesign")
set_font(r, size=16, color=MID_GRAY)

add_body(doc, "This report compares the existing Broadway website with the proposed redesign from a UI and UX, customer journey, accessibility, technology, and marketing perspective. It is intended to support a team decision on what should be retained, what must be corrected, and what should be completed before launch.")

meta = doc.add_table(rows=3, cols=2)
meta.alignment = WD_TABLE_ALIGNMENT.LEFT
meta.autofit = False
set_table_borders(meta, color="E4E8EE", size="4")
meta_rows = [
    ("Prepared for", "Broadway Communication team"),
    ("Assessment date", "15 October 2026"),
    ("Recommendation", "Proceed with the redesign after conversion, trust, accessibility, and support gaps are closed"),
]
for ri, (label, value) in enumerate(meta_rows):
    for ci, text in enumerate((label, value)):
        cell = meta.rows[ri].cells[ci]
        set_cell_width(cell, 1.5 if ci == 0 else 5.1)
        set_cell_margins(cell)
        shade_cell(cell, PALE_GRAY if ci == 0 else "FFFFFF")
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(text)
        set_font(run, size=9.5, bold=(ci == 0), color="000000")

doc.add_page_break()

add_heading(doc, "1 Executive summary", 1)
add_body(doc, "The proposed redesign is a clear improvement in brand positioning, visual hierarchy, audience relevance, and perceived technical capability. It presents Broadway as a Bengaluru infrastructure partner rather than only a broadband seller. However, it is not ready to replace the current website because it removes or weakens several high-value customer routes, including plans and prices, availability checking, click-to-call, WhatsApp, and a dependable support path.")
add_body(doc, "Recommended decision: approve the redesign direction, but do not launch it as a direct replacement until the lead form is connected, contact and compliance content is verified, support navigation works, scroll behaviour is made user-controlled, and the commercial shortcuts from the current website are restored.", bold_lead="Recommended decision:")
add_score_table(doc)

add_heading(doc, "Key conclusions", 2)
add_bullet(doc, "The current website is commercially practical but visually generic and difficult to scan.")
add_bullet(doc, "The redesign creates a stronger and more memorable Broadway identity with a clearer story.")
add_bullet(doc, "The redesign improves audience segmentation and enquiry context, which can create better-qualified leads.")
add_bullet(doc, "The current website remains stronger for customers who want price, availability, phone, WhatsApp, or support immediately.")
add_bullet(doc, "The best production solution combines the redesign's brand and narrative with the current website's fastest buying and support routes.")

add_heading(doc, "2 Scope and evaluation approach", 1)
add_body(doc, "The comparison covers the public demo at https://codemythought.in/demo/broadway/index.php and the proposed redesign in the Full Screen Home Web project. The review considered desktop and compact mobile behaviour, page flow, content hierarchy, customer decision paths, enquiry handling, accessibility intent, performance signals, technical maintainability, trust, and marketing effectiveness.")
add_body(doc, "Scores are directional design and business assessments rather than analytics-based conversion measurements. Performance observations reflect the review conditions and should be confirmed through production monitoring after deployment.")

add_heading(doc, "3 Current website assessment", 1)
add_heading(doc, "What the current website does well", 2)
add_bullet(doc, "Shows home internet plans and prices, including speed tiers, without requiring a sales conversation first.")
add_bullet(doc, "Provides click-to-call and WhatsApp options, reducing friction for urgent or mobile-first visitors.")
add_bullet(doc, "Includes a PIN code and building availability route for home broadband customers.")
add_bullet(doc, "Communicates a useful local-service advantage: a nearby team rather than a distant call centre.")
add_bullet(doc, "Covers a broad service portfolio and gives visitors several ways to reach the business.")

add_heading(doc, "Problems affecting leads and trust", 2)
add_table(
    doc,
    ["Issue", "Observed condition", "Business impact"],
    [
        ("Lead forms", "Forms submit to a placeholder destination rather than a working lead system.", "Enquiries can be lost and campaign performance cannot be measured."),
        ("First impression", "A rotating carousel presents different messages for CCTV, leased lines, and fibre.", "Visitors do not receive one clear reason to choose Broadway."),
        ("Performance", "The reviewed first visit took about 11 seconds and loaded 99 requests, 1.7 MB, and 26 scripts.", "Visitors may leave before meaningful content appears."),
        ("Mobile experience", "The page is approximately 13,600 pixels long, with no persistent mobile contact bar.", "High-effort scrolling delays price and contact decisions."),
        ("Content visibility", "Some sections remain hidden until their scroll animations run.", "Fast scrolling or slow devices can reveal empty areas."),
        ("Trust signals", "Testimonials are anonymous and social icons link to placeholders.", "Proof feels generic and parts of the site appear unfinished."),
    ],
    [1.35, 3.05, 2.2],
    font_size=9.2,
)

add_heading(doc, "Current customer flow", 2)
add_body(doc, "The homepage moves from a multi-message hero into service cards, plans, coverage forms, FAQs, industries, testimonials, and contact information. The breadth is useful, but the order gives too many elements similar visual weight. Plans appear well below the opening content even though price and availability are primary questions for home buyers. The result is a catalogue rather than a guided decision journey.")

add_heading(doc, "4 Proposed redesign assessment", 1)
add_heading(doc, "What was changed", 2)
add_table(
    doc,
    ["Change", "What was introduced", "Why it matters"],
    [
        ("Connected Bengaluru hero", "A full-screen city scene presents Broadway as infrastructure across homes, communities, businesses, and institutions.", "Creates a distinctive local story and increases perceived scale."),
        ("Single message", "One central promise and two primary actions replace a rotating set of competing campaigns.", "Improves comprehension and recall in the first few seconds."),
        ("Service families", "Services are grouped into clear solution families instead of appearing as an undifferentiated list.", "Reduces cognitive load and makes the portfolio easier to understand."),
        ("Audience paths", "Homes, apartment communities, businesses, and institutions receive tailored needs and outcomes.", "Visitors can recognise their context and move into a relevant enquiry."),
        ("Delivery process", "Survey, design, installation, and support are shown as a repeatable method.", "Builds confidence for complex infrastructure buyers."),
        ("Contextual enquiry", "Service and audience selections can carry into the enquiry form.", "Reduces repetition and gives sales teams better lead context."),
    ],
    [1.45, 3.05, 2.1],
    font_size=9.1,
)

add_heading(doc, "Why these changes were needed", 2)
add_body(doc, "Broadway sells trust as much as technology. Apartment associations, facility teams, hospitals, campuses, and businesses judge a provider's capability before speaking to sales. A generic theme and fragmented message make the company appear smaller and less differentiated than its service range suggests. The redesign gives Broadway a clearer point of view, shows how multiple services fit together, and makes the company easier to remember.")

add_heading(doc, "5 Side by side comparison", 1)
add_table(
    doc,
    ["Area", "Current website", "Proposed redesign"],
    [
        ("First impression", "Three rotating messages and stock-led presentation.", "One Bengaluru-led story with a focused promise. Improvement."),
        ("Brand positioning", "Looks like a familiar telecom template.", "Feels custom, local, and infrastructure-led. Strong improvement."),
        ("Audience relevance", "Home and business paths are introduced but not consistently developed.", "Four audience groups receive tailored needs and outcomes. Strong improvement."),
        ("Service understanding", "Large catalogue of individual services with similar emphasis.", "Related services are grouped into understandable families. Improvement."),
        ("Plans and price", "Visible speed and price options help home buyers decide.", "Pricing and plan detail are not prominent. Regression."),
        ("Availability", "PIN and building route supports a direct buying question.", "No equivalent fast coverage route near the opening. Regression."),
        ("Contact", "Phone and WhatsApp are readily available.", "Contact depends too heavily on an enquiry form and includes placeholder details. Regression."),
        ("Lead quality", "Generic forms do not preserve much context.", "Selected audience and service can pre-fill the enquiry. Improvement."),
        ("Accessibility", "Missing labels and decorative text treatments create barriers.", "Better heading order, labelled fields, focus visibility, and reduced-motion intent, with modal and tab issues remaining. Improvement with fixes needed."),
        ("Technology", "Legacy jQuery theme and many plugins make optimisation and extension harder.", "Modern React and Vite foundation is easier to extend, provided animation and asset weight are controlled. Improvement."),
        ("Trust", "Anonymous testimonials and incomplete links weaken proof.", "Process content is stronger, but claims, testimonials, contact details, and compliance language must be verified. Incomplete."),
    ],
    [1.35, 2.65, 2.6],
    font_size=8.9,
)

add_heading(doc, "6 Work required before launch", 1)
add_heading(doc, "Launch blockers", 2)
add_table(
    doc,
    ["Priority", "Required action", "Reason"],
    [
        ("P0", "Connect the enquiry form to an approved email, CRM, or lead system and test successful and failed submissions.", "A website cannot support sales if enquiries remain in demo mode or are silently lost."),
        ("P0", "Replace placeholders and verify phone numbers, email addresses, office address, service areas, licence wording, regulatory claims, uptime statements, and testimonials.", "Incorrect trust content creates commercial and compliance risk."),
        ("P1", "Repair the Support route and give existing customers clear access to phone support, ticketing, bill payment, or the agreed support destination.", "Support discoverability is central to Broadway's local-accountability promise."),
        ("P1", "Remove wheel and touch blocking, shorten pinned sequences, and ensure all motion is interruptible.", "Visitors should never feel that the website has taken control of scrolling."),
        ("P1", "Complete keyboard focus management for dialogs and full keyboard behaviour for service tabs.", "Keyboard users must be able to enter, use, and exit interactive components predictably."),
        ("P1", "Restore plans, availability, click-to-call, WhatsApp, and a concise FAQ route.", "These answer the questions most likely to determine whether a home buyer contacts sales."),
        ("P1", "Remove unnecessary large preloads and convert oversized imagery to efficient formats.", "The visual concept should not create slow mobile loading."),
        ("P2", "Define a consistent type scale, colour tokens, and minimum text size; reduce repeated glow, glass, and decorative patterns.", "A restrained system will feel more mature and will be easier to maintain."),
        ("P2", "Use verified customer names, organisation logos, review sources, project photography, and measurable proof.", "Specific evidence converts better than generic marketing claims."),
    ],
    [0.7, 3.75, 2.15],
    font_size=8.8,
)

add_heading(doc, "7 Recommended production flow", 1)
add_number(doc, "Open with the Bengaluru brand story and a concise statement of Broadway's role.")
add_number(doc, "Immediately provide fast routes for View home plans, Check availability, Business enquiry, and Support.")
add_number(doc, "Introduce four to six clearly named solution families with short explanations.")
add_number(doc, "Help visitors choose a route based on whether they represent a home, apartment community, business, or institution.")
add_number(doc, "Show verified projects, customer proof, service-area evidence, and relevant business credentials.")
add_number(doc, "Explain the delivery process from survey and design through installation and ongoing support.")
add_number(doc, "Present plan and price detail with GST, installation, router, data, and OTT terms stated clearly.")
add_number(doc, "Use a short enquiry form that retains the selected service and audience context.")
add_number(doc, "End with visible phone, WhatsApp, office, service area, support, and legal information.")

add_heading(doc, "8 Three stage delivery plan", 1)
add_table(
    doc,
    ["Stage", "Focus", "Deliverables"],
    [
        ("Stage 1 Verification", "Trust and ownership", "Approve contact details, claims, coverage, testimonials, plan terms, support destinations, and lead-routing ownership."),
        ("Stage 2 Production hardening", "Functionality and accessibility", "Connect forms, fix Support links, complete dialog and tab keyboard behaviour, remove input blocking, optimise assets, and test responsive layouts."),
        ("Stage 3 Conversion improvement", "Sales and marketing", "Add plans, availability, phone and WhatsApp routes, verified proof, analytics events, local search content, and clearer mobile decision paths."),
    ],
    [1.45, 1.8, 3.35],
    font_size=9.2,
)

add_heading(doc, "Launch gate", 2)
add_body(doc, "The redesigned site should replace the current site only after all P0 and P1 items are closed and the experience is rechecked on desktop, mobile, keyboard-only navigation, reduced-motion settings, and realistic mobile network conditions. Form submissions and conversion events should be confirmed end to end before public launch.")

add_heading(doc, "9 Team talking points", 1)
add_bullet(doc, "This is not only a visual refresh. The redesign changes Broadway's position from a product seller to a complete local infrastructure partner.")
add_bullet(doc, "Audience-specific routes help home, community, business, and institutional visitors recognise the right solution faster.")
add_bullet(doc, "Context-aware enquiry paths reduce friction and can produce better-qualified leads for the sales team.")
add_bullet(doc, "The current website still answers price, availability, contact, and support questions more directly; those strengths must be brought into the redesign.")
add_bullet(doc, "The recommendation is therefore not to choose one version unchanged. It is to combine the redesign's brand strength with the current website's commercial clarity.")

add_heading(doc, "10 Final recommendation", 1)
add_body(doc, "Proceed with the proposed redesign as the foundation for Broadway's next website. Preserve the Bengaluru identity, stronger hierarchy, audience pathways, delivery process, and contextual enquiry design. Before launch, restore direct buying and support routes, connect lead handling, verify every trust claim, reduce scroll friction, and complete accessibility and performance work. The finished site should feel credible to enterprise and community buyers while allowing a home customer to check price, coverage, and contact options within seconds.")

# Footer
for sec in doc.sections:
    footer = sec.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    r = p.add_run("Broadway Website Comparison Report   |   15 October 2026")
    set_font(r, size=8, color=MID_GRAY)

OUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUT)
print(OUT)
