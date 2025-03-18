import type { Metadata } from "next";
import { AuthProvider } from '@/features/auth/AuthProvider'
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Meeting Scheduler",
  description: "Schedule meetings with Google Calendar integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}



