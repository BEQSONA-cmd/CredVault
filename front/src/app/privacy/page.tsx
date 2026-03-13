export default function Privacy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">

            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="space-y-6 text-gray-700">

                <p>
                    CredVault respects your privacy. This application is designed
                    to store credential information locally on your device only.
                </p>

                <h2 className="text-xl font-semibold">Data Storage</h2>
                <p>
                    All credentials saved in CredVault are stored locally on your
                    mobile device. The application does not upload or transmit
                    your data to any server.
                </p>

                <h2 className="text-xl font-semibold">No Data Collection</h2>
                <p>
                    CredVault does not collect, store, or share any personal
                    information or credentials from users.
                </p>

                <h2 className="text-xl font-semibold">Internet Access</h2>
                <p>
                    The application does not require an internet connection
                    to function.
                </p>

                <h2 className="text-xl font-semibold">Changes</h2>
                <p>
                    This privacy policy may be updated in the future if the
                    application functionality changes.
                </p>

                <p className="text-sm text-gray-500 pt-6">
                    Last updated: 2026
                </p>
            </div>
        </div>
    );
}
