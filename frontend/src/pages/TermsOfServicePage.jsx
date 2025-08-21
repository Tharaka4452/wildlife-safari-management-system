import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfServicePage = () => {
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
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using Wild Path Safari's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 mb-4">
                  Wild Path Safari provides wildlife safari experiences, tour packages, and related services in Sri Lanka. Our services include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Safari tour bookings and reservations</li>
                  <li>Wildlife photography tours</li>
                  <li>Educational wildlife experiences</li>
                  <li>Transportation and accommodation arrangements</li>
                  <li>Professional tour guide services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  3. Booking and Payment Terms
                </h2>
                <div className="space-y-4">
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">3.1 Reservations</h3>
                    <p className="text-gray-700">
                      All bookings are subject to availability. We recommend booking at least 2 weeks in advance for peak season tours.
                    </p>
                  </div>
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">3.2 Payment</h3>
                    <p className="text-gray-700">
                      Full payment is required at the time of booking. We accept major credit cards and bank transfers.
                    </p>
                  </div>
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">3.3 Pricing</h3>
                    <p className="text-gray-700">
                      All prices are quoted in Sri Lankan Rupees (LKR) and include applicable taxes. Prices are subject to change without notice.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  4. Cancellation and Refund Policy
                </h2>
                <div className="space-y-4">
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">4.1 Cancellation by Customer</h3>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>More than 7 days before tour: 90% refund</li>
                      <li>3-7 days before tour: 50% refund</li>
                      <li>Less than 3 days before tour: No refund</li>
                    </ul>
                  </div>
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">4.2 Cancellation by Company</h3>
                    <p className="text-gray-700">
                      We reserve the right to cancel tours due to weather conditions, safety concerns, or insufficient bookings. Full refunds will be provided in such cases.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  5. Safety and Conduct
                </h2>
                <div className="space-y-4">
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">5.1 Safety Guidelines</h3>
                    <p className="text-gray-700">
                      All participants must follow safety instructions provided by our guides. Failure to comply may result in removal from the tour without refund.
                    </p>
                  </div>
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">5.2 Age Restrictions</h3>
                    <p className="text-gray-700">
                      Children under 5 years are not permitted on safari tours. Children 5-12 years must be accompanied by an adult.
                    </p>
                  </div>
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">5.3 Health Requirements</h3>
                    <p className="text-gray-700">
                      Participants should be in good health. Please inform us of any medical conditions that may affect your participation.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  6. Liability and Insurance
                </h2>
                <p className="text-gray-700 mb-4">
                  Wild Path Safari maintains comprehensive insurance coverage. However, we are not liable for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Personal injury due to participant negligence</li>
                  <li>Loss or damage of personal belongings</li>
                  <li>Delays due to weather or natural events</li>
                  <li>Changes in wildlife behavior or sightings</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  7. Privacy and Data Protection
                </h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  8. Intellectual Property
                </h2>
                <p className="text-gray-700 mb-4">
                  All content on this website, including text, images, and logos, is the property of Wild Path Safari and is protected by copyright laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  9. Modifications to Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  10. Contact Information
                </h2>
                <p className="text-gray-700 mb-4">
                  For questions about these terms, please contact us:
                </p>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@wildpathsafari.com<br />
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

export default TermsOfServicePage;
