import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { CartFloatingButton } from "@/components/CartFloatingButton";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "M Donna Store",
    template: "%s | M Donna Store",
  },
  description: "تسوق أفضل الأجهزة المنزلية بضمان حقيقي ودفع عند الاستلام. جودة تثق بها وخدمة ما بعد البيع.",
  keywords: ["عطور", "اكسسوارات", "مكياج", "عناية بالبشرة", "m donna store", "مصر"],
  authors: [{ name: "M Donna Store" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://home-appliance-ecosystem.vercel.app/",
    title: "M Donna Store",
    description: "تسوق أفضل العطور والاكسسوارات بضمان حقيقي ودفع عند الاستلام. جودة تثق بها.",
    siteName: "M Donna Store",
    images: [
      {
        url: "/og-image.png", // This will be the file they choose
        width: 1200,
        height: 630,
        alt: "M Donna Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M Donna Store",
    description: "تسوق أفضل العطور والاكسسوارات بضمان حقيقي ودفع عند الاستلام",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use suppressHydrationWarning to stop Next.js warnings about theme classes injected by next-themes on the HTML tag
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full antialiased">
      <body className={`${cairo.className} min-h-full flex flex-col bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            {children}
            <CartDrawer />
            <CartFloatingButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
