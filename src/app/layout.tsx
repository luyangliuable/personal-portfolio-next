import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export const metadata: Metadata = {
    title: "Luyang's Website",
    description: "Passionate software engineer with expertise in web/mobile development, machine learning, and efficient time management with over 2 years of full- time industry experience."
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <NavBar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
