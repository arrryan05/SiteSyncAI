import "./globals.css";
import { AuthProvider } from "../hooks/usAuth";
import Navbar from "../components/NavBar";

export const metadata = {
  title: "SiteSync AI",
  description: "AI‑powered SEO & performance audits",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f2e] text-white">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
