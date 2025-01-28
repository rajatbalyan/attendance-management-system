import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { AttendanceProvider } from "@/lib/attendance-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Attendance Management System",
  description: "Track and manage employee attendance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AttendanceProvider>
          <Navigation />
          {children}
        </AttendanceProvider>
      </body>
    </html>
  );
}
