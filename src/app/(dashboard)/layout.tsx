import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locci Dashboard",
  description: "Locci Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header/>
      <main className="container flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>  
    </>
  );
}
