import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToTravelPackages = () => {
    navigate('/travel-packages');
  };

  const navigateToContact = () => {
    navigate('/contact');
  };

  const navigateToAbout = () => {
    navigate('/about');
  };

  const navigateToGallery = () => {
    navigate('/gallery');
  };

  const navigateToPrivacyPolicy = () => {
    navigate('/privacy-policy');
  };

  const navigateToTermsOfService = () => {
    navigate('/terms-of-service');
  };

  const navigateToCookiePolicy = () => {
    navigate('/cookie-policy');
  };

  const handleWildlifeAwareness = () => {
    // If we're on the homepage, scroll to awareness section
    if (location.pathname === '/') {
      const element = document.getElementById('awareness');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to homepage first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('awareness');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white relative z-10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src={logo} 
                alt="Wild Path Logo" 
                className="h-16 w-auto mb-4"
              />
              <p className="text-sm font-abeze font-light tracking-wider text-gray-300">WILDLIFE</p>
            </div>
            <p className="text-gray-300 font-abeze text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-abeze font-bold text-white mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={navigateToHome}
                  className="text-gray-300 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
                >
                  {t('footer.links.home')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleWildlifeAwareness}
                  className="text-gray-300 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
                >
                  {t('footer.links.wildlifeAwareness')}
                </button>
              </li>
              <li>
                <button 
                  onClick={navigateToTravelPackages}
                  className="text-gray-300 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
                >
                  {t('footer.links.safariPackages')}
                </button>
              </li>
              <li>
                <button 
                  onClick={navigateToGallery}
                  className="text-gray-300 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
                >
                  {t('footer.links.gallery')}
                </button>
              </li>
              <li>
                <button 
                  onClick={navigateToAbout}
                  className="text-gray-300 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
                >
                  {t('footer.links.aboutUs')}
                </button>
              </li>
              <li>
                <button 
                  onClick={navigateToContact}
                  className="text-gray-300 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
                >
                  {t('footer.links.contact')}
                </button>
              </li>
            </ul>
          </div>



          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-abeze font-bold text-white mb-6">{t('footer.contactInfo')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <p className="text-gray-300 font-abeze text-sm">{t('footer.contact.address.line1')}</p>
                  <p className="text-gray-300 font-abeze text-sm">{t('footer.contact.address.line2')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="text-gray-300 font-abeze text-sm">{t('footer.contact.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="text-gray-300 font-abeze text-sm">{t('footer.contact.email')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-gray-300 font-abeze text-sm">{t('footer.contact.hours')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 font-abeze text-sm mb-4 md:mb-0">
              © {currentYear} {t('footer.copyright')}
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={navigateToPrivacyPolicy}
                className="text-gray-400 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
              >
                {t('footer.policies.privacy')}
              </button>
              <button 
                onClick={navigateToTermsOfService}
                className="text-gray-400 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
              >
                {t('footer.policies.terms')}
              </button>
              <button 
                onClick={navigateToCookiePolicy}
                className="text-gray-400 hover:text-green-400 transition-colors font-abeze text-sm cursor-pointer"
              >
                {t('footer.policies.cookies')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 