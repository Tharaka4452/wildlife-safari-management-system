import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CookiePolicyPage = () => {
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
              Cookie Policy
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  1. What Are Cookies?
                </h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are placed on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences, 
                  analyzing how you use our site, and personalizing content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  2. Types of Cookies We Use
                </h2>
                <div className="space-y-6">
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">2.1 Essential Cookies</h3>
                    <p className="text-gray-700 mb-2">
                      These cookies are necessary for the website to function properly. They enable basic functions like:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>User authentication and login sessions</li>
                      <li>Shopping cart functionality</li>
                      <li>Security features</li>
                      <li>Language preferences</li>
                    </ul>
                  </div>
                  
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">2.2 Performance Cookies</h3>
                    <p className="text-gray-700 mb-2">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>Page load times and performance metrics</li>
                      <li>Most visited pages and features</li>
                      <li>Error messages and technical issues</li>
                      <li>User journey analysis</li>
                    </ul>
                  </div>
                  
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">2.3 Functionality Cookies</h3>
                    <p className="text-gray-700 mb-2">
                      These cookies allow the website to remember choices you make and provide enhanced features:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>Remembering your preferred language</li>
                      <li>Storing your booking preferences</li>
                      <li>Personalizing content and recommendations</li>
                      <li>Maintaining your login status</li>
                    </ul>
                  </div>
                  
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">2.4 Marketing Cookies</h3>
                    <p className="text-gray-700 mb-2">
                      These cookies are used to track visitors across websites to display relevant advertisements:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>Social media integration</li>
                      <li>Advertising campaign tracking</li>
                      <li>Retargeting and remarketing</li>
                      <li>Analytics for marketing purposes</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  3. Third-Party Cookies
                </h2>
                <p className="text-gray-700 mb-4">
                  We may use third-party services that place cookies on your device. These services include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing and integration</li>
                  <li><strong>Advertising Networks:</strong> For relevant advertising content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  4. How Long Do Cookies Last?
                </h2>
                <div className="space-y-4">
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">4.1 Session Cookies</h3>
                    <p className="text-gray-700">
                      These cookies are temporary and are deleted when you close your browser. They are used for basic website functionality.
                    </p>
                  </div>
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">4.2 Persistent Cookies</h3>
                    <p className="text-gray-700">
                      These cookies remain on your device for a set period or until you delete them. They remember your preferences and settings.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  5. Managing Your Cookie Preferences
                </h2>
                <div className="space-y-4">
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">5.1 Browser Settings</h3>
                    <p className="text-gray-700 mb-2">
                      You can control cookies through your browser settings:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>Block all cookies</li>
                      <li>Allow cookies from specific websites</li>
                      <li>Delete existing cookies</li>
                      <li>Set cookie expiration times</li>
                    </ul>
                  </div>
                                     <div>
                     <h3 className="text-xl font-abeze font-semibold text-green-600 mb-2">5.2 Cookie Consent</h3>
                    <p className="text-gray-700">
                      When you first visit our website, you'll see a cookie consent banner. You can change your preferences at any time through our cookie settings.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  6. Impact of Disabling Cookies
                </h2>
                <p className="text-gray-700 mb-4">
                  If you choose to disable cookies, some features of our website may not function properly:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>You may need to log in repeatedly</li>
                  <li>Your preferences won't be remembered</li>
                  <li>Some interactive features may not work</li>
                  <li>Personalized content may not be available</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  7. Updates to This Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  We may update this cookie policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  8. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies or this cookie policy, please contact us:
                </p>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@wildpathsafari.com<br />
                    <strong>Phone:</strong> +94 11 234 5678<br />
                    <strong>Address:</strong> 123 Safari Road, Colombo, Sri Lanka
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-abeze font-semibold text-green-700 mb-4">
                  9. Cookie Settings
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-abeze font-semibold text-green-800 mb-3">
                    Manage Your Cookie Preferences
                  </h3>
                  <p className="text-green-700 mb-4">
                    You can customize your cookie preferences below. Essential cookies cannot be disabled as they are necessary for the website to function.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800">Essential Cookies</span>
                      <span className="text-green-600 text-sm">Always Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-800">Performance Cookies</span>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-800">Functionality Cookies</span>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-800">Marketing Cookies</span>
                      <button className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500">
                        Disable
                      </button>
                    </div>
                  </div>
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

export default CookiePolicyPage;
