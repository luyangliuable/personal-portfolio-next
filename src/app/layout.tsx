import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Providers } from "../stores/provider";
import ContentArea from "../components/ContentArea/ContentArea";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

export const metadata: Metadata = {
    title: "Luyang's Website",
    description:
        "Passionate software engineer with 2+ years of experience in web/mobile development, machine learning, and time management.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="preload"
                    href="/src/assets/fonts/M1M/m1m-light.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/src/assets/fonts/AileronBlack/aileron-regular.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </head>
            <body>
                <ErrorBoundary>
                    <Providers>
                        <ContentArea>
                            <NavBar />
                            {children}
                        </ContentArea>
                        <Footer />
                    </Providers>
                </ErrorBoundary>
            </body>
        </html>
    );
}
