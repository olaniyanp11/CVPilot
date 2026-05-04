import type { Metadata } from "next";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";

export const metadata: Metadata = {
  title: "CVPilot — AI Resume Optimizer",
  description:
    "Upload your resume, paste a job description, and get an instant ATS score with AI-powered rewrites. Land more interviews.",
  openGraph: {
    title: "CVPilot — AI Resume Optimizer",
    description: "Land more interviews with AI-powered resume optimization.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-cream-100 text-ink antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
