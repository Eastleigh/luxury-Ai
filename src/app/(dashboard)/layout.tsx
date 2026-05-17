import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-0 lg:pl-[260px]">
        <Header />
        <main className="flex-1 p-4 pt-16 lg:p-6 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}
