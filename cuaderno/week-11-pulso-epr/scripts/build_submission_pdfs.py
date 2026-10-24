from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"

NAVY = colors.HexColor("#102B35")
GREEN = colors.HexColor("#17664A")
IVORY = colors.HexColor("#F8F5ED")
PALE_GREEN = colors.HexColor("#DBEADE")
AMBER = colors.HexColor("#A8620A")
MUTED = colors.HexColor("#65767B")
LINE = colors.HexColor("#D8D5CA")
CORAL = colors.HexColor("#B84938")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("ArialCustom", "/System/Library/Fonts/Supplemental/Arial.ttf"))
    pdfmetrics.registerFont(TTFont("ArialCustom-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
    pdfmetrics.registerFont(TTFont("GeorgiaCustom-Italic", "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"))


def clean(text: str) -> str:
    return (
        text.replace("—", "-")
        .replace("–", "-")
        .replace("‑", "-")
        .replace("→", "->")
        .replace("·", "|")
        .replace("…", "...")
    )


def inline_markup(text: str) -> str:
    text = clean(text)
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", r'<link href="\2" color="#17664A"><u>\1</u></link>', text)
    text = re.sub(r"`([^`]+)`", r'<font name="Courier">\1</font>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", text)
    return text


def make_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="ArialCustom-Bold",
            fontSize=27,
            leading=31,
            textColor=NAVY,
            alignment=TA_LEFT,
            spaceAfter=12,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="ArialCustom-Bold",
            fontSize=16,
            leading=20,
            textColor=GREEN,
            spaceBefore=18,
            spaceAfter=8,
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "H3",
            parent=base["Heading3"],
            fontName="ArialCustom-Bold",
            fontSize=11.5,
            leading=15,
            textColor=NAVY,
            spaceBefore=12,
            spaceAfter=5,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="ArialCustom",
            fontSize=9.2,
            leading=13.2,
            textColor=NAVY,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName="ArialCustom",
            fontSize=8.9,
            leading=12.5,
            textColor=NAVY,
            leftIndent=14,
            firstLineIndent=-8,
            bulletIndent=2,
            spaceAfter=3,
        ),
        "quote": ParagraphStyle(
            "Quote",
            parent=base["BodyText"],
            fontName="GeorgiaCustom-Italic",
            fontSize=10.5,
            leading=15,
            textColor=GREEN,
            leftIndent=12,
            rightIndent=12,
            borderColor=GREEN,
            borderWidth=0,
            borderPadding=8,
            backColor=PALE_GREEN,
            spaceBefore=5,
            spaceAfter=8,
        ),
        "code": ParagraphStyle(
            "Code",
            fontName="Courier",
            fontSize=6.7,
            leading=9,
            textColor=NAVY,
            leftIndent=6,
            rightIndent=6,
            borderPadding=8,
            borderColor=LINE,
            borderWidth=.6,
            backColor=colors.HexColor("#F1F0EA"),
            spaceBefore=5,
            spaceAfter=9,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=base["BodyText"],
            fontName="ArialCustom-Bold",
            fontSize=8,
            leading=11,
            textColor=MUTED,
            spaceAfter=3,
        ),
        "table": ParagraphStyle(
            "Table",
            parent=base["BodyText"],
            fontName="ArialCustom",
            fontSize=7.2,
            leading=9.4,
            textColor=NAVY,
        ),
        "table_head": ParagraphStyle(
            "TableHead",
            parent=base["BodyText"],
            fontName="ArialCustom-Bold",
            fontSize=7.2,
            leading=9.4,
            textColor=colors.white,
        ),
    }


class CourseworkDoc(BaseDocTemplate):
    def __init__(self, path: Path, short_title: str):
        super().__init__(
            str(path),
            pagesize=A4,
            leftMargin=19 * mm,
            rightMargin=19 * mm,
            topMargin=20 * mm,
            bottomMargin=18 * mm,
            title=short_title,
            author="David Buzali",
        )
        self.short_title = short_title
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="body")
        self.addPageTemplates(PageTemplate(id="main", frames=[frame], onPage=self._draw_page))

    def _draw_page(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(IVORY)
        canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
        canvas.setFillColor(NAVY)
        canvas.rect(0, A4[1] - 8 * mm, A4[0], 8 * mm, fill=1, stroke=0)
        canvas.setFont("ArialCustom-Bold", 7.5)
        canvas.setFillColor(GREEN)
        canvas.drawString(19 * mm, 10 * mm, "PULSO EPR | BUSINESS BENDING | WEEK 11")
        canvas.setFont("ArialCustom", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(A4[0] - 19 * mm, 10 * mm, f"{self.short_title}  |  {doc.page}")
        canvas.restoreState()


def parse_table(lines: list[str], styles) -> Table:
    rows: list[list[Paragraph]] = []
    for index, line in enumerate(lines):
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if index == 1 and all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        style = styles["table_head"] if index == 0 else styles["table"]
        rows.append([Paragraph(inline_markup(cell), style) for cell in cells])
    col_count = max(len(row) for row in rows)
    widths = [175 * mm / col_count] * col_count
    table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("GRID", (0, 0), (-1, -1), .35, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F4F2EA")]),
    ]))
    return table


def markdown_story(source: Path, styles) -> list:
    lines = source.read_text(encoding="utf-8").splitlines()
    story: list = []
    paragraph_buffer: list[str] = []
    in_code = False
    code_lines: list[str] = []
    code_lang = ""

    def flush_paragraph():
        if paragraph_buffer:
            text = " ".join(line.strip() for line in paragraph_buffer)
            style = styles["meta"] if text.startswith("**Owner:") or text.startswith("**Date:") else styles["body"]
            story.append(Paragraph(inline_markup(text), style))
            paragraph_buffer.clear()

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if stripped.startswith("```"):
            flush_paragraph()
            if in_code:
                label = f"[{code_lang.upper()} DIAGRAM SOURCE]\n" if code_lang else ""
                story.append(Preformatted(label + clean("\n".join(code_lines)), styles["code"], maxLineLength=105))
                code_lines = []
                code_lang = ""
                in_code = False
            else:
                code_lang = stripped[3:].strip()
                in_code = True
            i += 1
            continue
        if in_code:
            code_lines.append(line)
            i += 1
            continue
        if not stripped:
            flush_paragraph()
            story.append(Spacer(1, 2.5 * mm))
            i += 1
            continue
        image_match = re.fullmatch(r"!\[([^\]]*)\]\(([^)]+)\)", stripped)
        if image_match:
            flush_paragraph()
            image_path = (source.parent / image_match.group(2)).resolve()
            if image_path.exists():
                img = Image(str(image_path))
                max_w, max_h = 175 * mm, 94 * mm
                scale = min(max_w / img.imageWidth, max_h / img.imageHeight)
                img.drawWidth = img.imageWidth * scale
                img.drawHeight = img.imageHeight * scale
                img.hAlign = "CENTER"
                story.extend([img, Spacer(1, 3 * mm)])
            i += 1
            continue
        if stripped.startswith("|") and stripped.endswith("|"):
            flush_paragraph()
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|") and lines[i].strip().endswith("|"):
                table_lines.append(lines[i])
                i += 1
            story.extend([parse_table(table_lines, styles), Spacer(1, 3 * mm)])
            continue
        if stripped.startswith("# "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(stripped[2:]), styles["title"]))
            story.append(Table([[""]], colWidths=[36 * mm], rowHeights=[1.2 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), GREEN)])))
            story.append(Spacer(1, 4 * mm))
        elif stripped.startswith("## "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(stripped[3:]), styles["h2"]))
        elif stripped.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(stripped[4:]), styles["h3"]))
        elif stripped.startswith("> "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(stripped[2:]), styles["quote"]))
        elif re.match(r"^[-*] ", stripped):
            flush_paragraph()
            story.append(Paragraph(inline_markup(stripped[2:]), styles["bullet"], bulletText="•"))
        elif re.match(r"^\d+\. ", stripped):
            flush_paragraph()
            number, text = stripped.split(". ", 1)
            story.append(Paragraph(inline_markup(text), styles["bullet"], bulletText=f"{number}."))
        elif stripped == "---":
            flush_paragraph()
            story.append(Spacer(1, 2 * mm))
        else:
            paragraph_buffer.append(line)
        i += 1
    flush_paragraph()
    while story and isinstance(story[-1], Spacer):
        story.pop()
    return story


def build(source_name: str, output_name: str, short_title: str) -> None:
    styles = make_styles()
    source = ROOT / "docs" / source_name
    output = OUT / output_name
    doc = CourseworkDoc(output, short_title)
    story = markdown_story(source, styles)
    doc.build(story)
    print(f"built {output}")


def main() -> None:
    register_fonts()
    OUT.mkdir(parents=True, exist_ok=True)
    build("PACKET.md", "PACKET_David_Buzali.pdf", "PACKET")
    build("PERSONA.md", "PERSONA_David_Buzali.pdf", "PERSONA")
    build("BUILDCHAT.md", "BUILDCHAT_David_Buzali.pdf", "BUILDCHAT")


if __name__ == "__main__":
    main()

