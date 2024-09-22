import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Providers } from "../stores/provider";

export const metadata: Metadata = {
    title: "Luyang's Website",
description: "Passionate software engineer with 2+ years of experience in web/mobile development, machine learning, and time management."
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <NavBar />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
