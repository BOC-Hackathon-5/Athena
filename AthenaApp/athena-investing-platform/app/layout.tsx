import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define metadata for the page
export const metadata: Metadata = {
  title: "Athena Investing Platform",
  description: "Manage your investments with ease on the Athena Investing Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta tag for mobile-friendly design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={bodyStyles}
      >
        {children}
      </body>
    </html>
  );
}

// Custom styles for the body element
const bodyStyles = {
  margin: 0,
  padding: 0,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f0f0f0", // Light background to make text stand out
};
