import ResumeUpload from "@/components/ResumeUpload";

export const metadata = {
  title: "Upload Resume — CVPilot",
};

export default function UploadPage() {
  return (
    <main className="min-h-[calc(100vh-0px)] bg-cream-100 px-4 py-10 pt-28">
      <ResumeUpload />
    </main>
  );
}

