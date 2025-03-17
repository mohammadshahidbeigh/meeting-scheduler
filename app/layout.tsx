import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from '@/components/AuthProvider'
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

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
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
