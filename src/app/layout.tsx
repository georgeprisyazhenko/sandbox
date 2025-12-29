import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мониторинг опционов MOEX",
  description:
    "Отслеживание call-опционов срочного рынка Московской биржи (FORTS)",
  icons: {
    icon: "/iconop.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-oid="b1jifow">
      <body className="antialiased" data-oid="hqec2:a">
        {children}

        <Script
          src="https://cdn.jsdelivr.net/gh/onlook-dev/onlook@d3887f2/apps/web/client/public/onlook-preload-script.js"
          strategy="afterInteractive"
          type="module"
          id="onlook-preload-script"
          data-oid="ocfv681"
        ></Script>
      </body>
    </html>
  );
}