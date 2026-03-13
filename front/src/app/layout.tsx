import "./globals.css";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { FaShieldAlt } from "react-icons/fa";

export const metadata = {
    title: "CredVault",
    description:
        "CredVault is a simple and secure credential manager that stores your login data locally on your device.",
};

interface AppProps {
    children: ReactNode;
}

export default function App({ children }: AppProps) {
    return (
        <html lang="en">
            <body className="bg-gray-50 min-h-screen flex flex-col">

                {/* Header */}
                <header className="bg-blue-600 text-white">
                    <div className="container mx-auto flex justify-between items-center p-4">
                        <Link href="/" className="flex items-center text-xl font-bold">
                            <FaShieldAlt className="mr-2 text-2xl" />
                            CredVault
                        </Link>

                        <nav className="flex gap-6">
                            <Link href="/" className="hover:underline">
                                Home
                            </Link>
                            <Link href="/privacy" className="hover:underline">
                                Privacy
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-grow">{children}</main>

                {/* Footer */}
                <footer className="bg-gray-200 p-4">
                    <div className="container mx-auto text-center text-sm">
                        <p>
                            © CredVault | Design by{" "}
                            <a
                                href="https://github.com/BEQSONA-cmd"
                                className="text-blue-600"
                                target="_blank"
                            >
                                BEQSONA-cmd
                            </a>
                        </p>
                    </div>
                </footer>

                <ToastContainer />
            </body>
        </html>
    );
}
