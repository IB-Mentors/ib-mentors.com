import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MeasurementBodyStart, MeasurementHead } from "@/components/measurement/MeasurementTags";
import { MeasurementListener } from "@/components/measurement/MeasurementListener";

// No metadataBase: every URL pageMetadata() emits is already absolute, and with a metadataBase Next rewrites the home
// canonical / og:url "https://ib-mentors.com/" to "https://ib-mentors.com" (no slash), unlike the mirror.
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/framer/3kpYpmd2XUV96ggNPJBbPXOXuQ.png", media: "(prefers-color-scheme: light)" },
      { url: "/framer/3kpYpmd2XUV96ggNPJBbPXOXuQ.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/framer/8HI0sLtPdlqyURfKyeQ2iJKHAg.png",
  },
};

export const viewport: Viewport = { width: "device-width" };

// Single locale: the Framer site and the static mirror are Japanese only (<html lang="ja">).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <MeasurementHead />
      </head>
      <body>
        <MeasurementBodyStart />
        {children}
        <MeasurementListener />
      </body>
    </html>
  );
}
