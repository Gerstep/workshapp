import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Breadcrumbs from "@/components/Breadcrumbs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Researcher App",
  description: "Do research and workshops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto px-4">
          <Breadcrumbs />
          {children}
        </div>
      </body>
    </html>
  );
}