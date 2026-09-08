import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ScrollProvider } from "@/context/ScrollContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keval Savaliya - AI Systems Engineer",
  description:
    "I build intelligent systems, I own my direction, and I do not stop iterating.",
};

const themeInitScript = `
try {
  var t = window.localStorage.getItem("theme");
  document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <ScrollProvider>{children}</ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
