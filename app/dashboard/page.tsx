import DashboardClient from "./ui";

export const metadata = {
  title: "Dashboard — CVPilot",
};

export default function DashboardPage() {
  return (
    <main className="min-h-[calc(100vh-0px)] bg-cream-100 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <DashboardClient />
      </div>
    </main>
  );
}

