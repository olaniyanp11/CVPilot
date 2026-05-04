import { NextResponse } from "next/server";
import { parseResumeFile } from "@/lib/parser";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Missing file field named 'file'." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "File too large (max 10MB)." },
        { status: 413 },
      );
    }

    const parsed = await parseResumeFile(file);

    if (!parsed.text) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No extractable text found. If this is a scanned PDF, please upload a text-based PDF or DOCX.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      ok: true,
      resume: parsed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    const status = message.toLowerCase().includes("unsupported file type")
      ? 400
      : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

