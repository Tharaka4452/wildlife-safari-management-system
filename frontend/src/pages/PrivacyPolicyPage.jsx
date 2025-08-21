import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="min-h-screen bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-green-100">
            <h1 className="text-3xl font-abeze font-bold text-green-800 mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a booking, or contact us. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Name, email address, and phone number</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Booking preferences and special requests</li>
                  <li>Communication history with our team</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Process and manage your safari bookings</li>
                  <li>Communicate with you about your reservations</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send you updates about our services (with your consent)</li>
                  <li>Improve our website and services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With trusted service providers who assist in our operations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  4. Data Security
                </h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  5. Your Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  6. Cookies and Tracking
                </h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, 
                  analyze website traffic, and understand where our visitors are coming from. 
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  7. Changes to This Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  We may update this privacy policy from time to time. We will notify you of any 
                  material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  8. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this privacy policy or our data practices, 
                  please contact us at:
                </p>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@wildpathsafari.com<br />
                    <strong>Phone:</strong> +94 11 234 5678<br />
                    <strong>Address:</strong> 123 Safari Road, Colombo, Sri Lanka
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
