import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

function wrapLines(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line) {
      lines.push("");
      continue;
    }
    let cur = line;
    while (cur.length > maxChars) {
      let cut = cur.lastIndexOf(" ", maxChars);
      if (cut < 20) cut = maxChars;
      lines.push(cur.slice(0, cut).trimEnd());
      cur = cur.slice(cut).trimStart();
    }
    lines.push(cur);
  }
  return lines;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: string; filename?: string };
    const text = body.text?.toString() ?? "";
    if (!text.trim()) {
      return NextResponse.json(
        { ok: false, error: "Missing optimized resume text." },
        { status: 400 },
      );
    }

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const pageMargin = 48;
    const fontSize = 11;
    const lineHeight = 14;

    let page = pdf.addPage();
    const { width, height } = page.getSize();
    let y = height - pageMargin;

    const maxChars = 95;
    const lines = wrapLines(text, maxChars);

    for (const line of lines) {
      if (y < pageMargin + lineHeight) {
        page = pdf.addPage();
        y = height - pageMargin;
      }
      page.drawText(line, {
        x: pageMargin,
        y,
        size: fontSize,
        font,
        color: rgb(0.05, 0.05, 0.05),
      });
      y -= lineHeight;
    }

    const bytes = await pdf.save();
    const filename = (body.filename?.trim() || "cvpilot-optimized-resume")
      .replace(/[^a-z0-9\-_.]+/gi, "-")
      .replace(/-+/g, "-");

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

