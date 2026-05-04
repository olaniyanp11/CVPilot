import AnalyzeClient from "./ui";

export const metadata = {
  title: "Analyze — CVPilot",
};

export default function AnalyzePage() {
  return (
    <main className="min-h-[calc(100vh-0px)] bg-cream-100 px-4 py-10 pt-28">
      <div className="mx-auto w-full max-w-3xl">
        <AnalyzeClient />
      </div>
    </main>
  );
}

