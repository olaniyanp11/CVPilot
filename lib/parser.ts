import mammoth from "mammoth";

export type SupportedResumeMime =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type ParsedResume = {
  filename: string;
  mimeType: SupportedResumeMime;
  text: string;
};

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function inferMimeType(file: File): SupportedResumeMime | null {
  const t = file.type?.toLowerCase();
  if (t === "application/pdf") return "application/pdf";
  if (
    t ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  const name = file.name?.toLowerCase() ?? "";
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return null;
}

export async function parseResumeFile(file: File): Promise<ParsedResume> {
  const mimeType = inferMimeType(file);
  if (!mimeType) {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (mimeType === "application/pdf") {
    // Import the library function directly (avoids pdf-parse's CLI/test harness path).
    const mod = (await import("pdf-parse/lib/pdf-parse")) as unknown as {
      default?: (data: Buffer) => Promise<{ text?: string }>;
    };
    const pdfParse =
      typeof mod.default === "function"
        ? mod.default
        : ((mod as unknown) as (data: Buffer) => Promise<{ text?: string }>);

    const data = await pdfParse(buffer);
    return {
      filename: file.name,
      mimeType,
      text: normalizeText(data.text ?? ""),
    };
  }

  const result = await mammoth.extractRawText({ buffer });
  return {
    filename: file.name,
    mimeType,
    text: normalizeText(result.value ?? ""),
  };
}

