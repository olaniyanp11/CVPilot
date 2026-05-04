declare module "pdf-parse/lib/pdf-parse" {
  export default function pdfParse(
    dataBuffer: Buffer,
    options?: unknown,
  ): Promise<{ text?: string }>;
}

