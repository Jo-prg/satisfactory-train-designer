import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satisfactory Train Designer",
  description: "Calculate and visualize train configurations for Satisfactory game logistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
