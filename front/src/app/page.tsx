"use client";

import { FaLock, FaMobileAlt, FaKey } from "react-icons/fa";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center text-center px-6 py-20">

            {/* Hero */}
            <img src="/icon.png" alt="CredVault Icon" className="w-16 h-16 mb-4" />
            <h1 className="text-5xl font-bold mb-6">CredVault</h1>

            <p className="text-lg text-gray-600 max-w-2xl mb-10">
                CredVault is a secure and simple credential manager that allows you
                to store your passwords and login information directly on your
                device. No servers, no cloud, no tracking — your data stays with you.
            </p>

            <div className="flex gap-4">
                <a
                    href="/privacy"
                    className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
                >
                    Privacy Policy
                </a>
            </div>

            {/* Features */}
            <section
                id="features"
                className="grid md:grid-cols-3 gap-10 mt-20 max-w-5xl"
            >
                <div className="bg-white p-6 rounded-xl shadow">
                    <FaLock className="text-blue-600 text-3xl mb-4 mx-auto" />
                    <h3 className="font-semibold text-lg mb-2">
                        Secure Storage
                    </h3>
                    <p className="text-gray-600">
                        Your credentials are stored locally on your device.
                        Nothing is uploaded to servers.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <FaMobileAlt className="text-blue-600 text-3xl mb-4 mx-auto" />
                    <h3 className="font-semibold text-lg mb-2">
                        Offline First
                    </h3>
                    <p className="text-gray-600">
                        CredVault works completely offline. No internet
                        connection required.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <FaKey className="text-blue-600 text-3xl mb-4 mx-auto" />
                    <h3 className="font-semibold text-lg mb-2">
                        Easy Credential Management
                    </h3>
                    <p className="text-gray-600">
                        Add, edit, and remove your credentials quickly with
                        a clean and simple interface.
                    </p>
                </div>
            </section>
        </div>
    );
}
