import { Navbar } from "@/components/ui/mini-navbar";

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white py-24">
                <div className="container mx-auto px-6 py-16 max-w-4xl">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-gray-600 mb-8">Last updated: June 15, 2025</p>

                        <p className="text-gray-700 leading-relaxed mb-8">
                            Scribe (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates this&nbsp;
                            <a href="https://scribe-app.xyz" className="text-blue-600 underline">website</a>
                            &nbsp;and the Scribe Chrome Extension (together called the &quot;Service&quot;).
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-8">
                            This privacy policy explains what data our extension collects and how we use it.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            By using our extension, you agree to the practices described here.
                        </p>
                    </div>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Information We Collect</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            Our extension collects words you interact with on supported websites and sends them to the connected web app (like the Scribe dashboard).
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            The Scribe Web App collects personal details like your name and email when you sign up or log in.
                            However, the Chrome extension itself <strong>does not</strong> collect any personal information such as your name, email, location, or passwords.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            We use the information we collect to provide and maintain our Service, including:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mb-8">
                            <li>Helping you save and access your words through the Web App.</li>
                            <li>Communicating updates, changes, or support related to the service.</li>
                            <li>Personalizing your experience in the Web App.</li>
                            <li>Ensuring security and preventing abuse.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Sharing and Disclosure</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            We do not sell or share your personal information with third parties except in the following cases:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mb-8">
                            <li>With your consent.</li>
                            <li>To comply with legal obligations or respond to lawful requests.</li>
                            <li>To protect the rights and safety of Scribe, our users or the public.</li>
                            <li>With trusted service providers who help us operate the Service and who agree to keep your data confidential.</li>
                            <li>
                                When using custom or public APIs (for example, dictionary APIs) to provide features,
                                we only send necessary non-personal data (like words you request information about).
                                No personal or identifying information is shared with these APIs.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            We take reasonable measures to protect your personal information from unauthorized access or disclosure.
                            However, no online service can guarantee 100% security.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Choices and Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            You can update or delete your account information on the Scribe Web App at any time. If you want to remove your personal data or have questions, please contact us.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            We may update this policy occasionally. Any changes will be posted on this page with the updated date.
                            We encourage you to review this page regularly.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about this policy, you can contact the developer.
                        </p>
                        <ul className="space-y-2 mt-4 text-gray-700">
                            <li className="flex flex-row items-start">
                                <span className="mr-3">•</span>
                                <span>Email: <a href="mailto:dawnsaju@trigenlabs.tech" className="text-blue-600 underline">dawnsaju@trigenlabs.tech</a></span>
                            </li>
                            <li className="flex flex-row items-start">
                                <span className="mr-3">•</span>
                                <span>Website: <a href="https://scribe-app.xyz" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://scribe-app.xyz</a></span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    )
}
