import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Awareness from './components/Awareness'
import Chatbot from './components/Chatbot'
import TravelPackagesPage from './pages/TravelPackagesPage'
import ContactUsPage from './pages/ContactUsPage'
import AboutUsPage from './pages/AboutUsPage'
import UserAccountPage from './pages/UserAccountPage'
import AdminPage from './pages/AdminPage'
import BookingPage from './pages/BookingPage'
import BookingSuccessPage from './pages/BookingSuccessPage'
import BookingCancelledPage from './pages/BookingCancelledPage'
import DriverDashboard from './pages/DriverDashboard'
import TourGuideDashboard from './pages/TourGuideDashboard'
import DonatePage from './pages/DonatePage'
import DonationDetailsPage from './pages/DonationDetailsPage'
import DonationSuccessPage from './pages/DonationSuccessPage'
import DonationCancelledPage from './pages/DonationCancelledPage'
import GalleryPage from './pages/GalleryPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import ProtectedStaffRoute from './components/ProtectedStaffRoute'
import './App.css'

function MainPage() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Awareness />
      <Footer />
    </div>
  )
}

// Component to conditionally render chatbot based on current route
function ChatbotWrapper() {
  const location = useLocation();
  
  // Define routes where chatbot should NOT appear
  const excludedRoutes = [
    '/admin',
    '/driver-dashboard', 
    '/tour-guide-dashboard',
    '/account'
  ];
  
  // Check if current path should show chatbot
  const shouldShowChatbot = !excludedRoutes.some(route => 
    location.pathname.startsWith(route)
  );
  
  return shouldShowChatbot ? <Chatbot /> : null;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/travel-packages" element={<TravelPackagesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/donation-details" element={<DonationDetailsPage />} />
              <Route path="/donation-success" element={<DonationSuccessPage />} />
              <Route path="/donation-cancelled" element={<DonationCancelledPage />} />
              <Route path="/account" element={
                <ProtectedRoute>
                  <UserAccountPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              } />
              <Route path="/booking/:packageId" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/booking-success" element={<BookingSuccessPage />} />
              <Route path="/booking-cancelled" element={<BookingCancelledPage />} />
              <Route path="/driver-dashboard" element={
                <ProtectedStaffRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </ProtectedStaffRoute>
              } />
              <Route path="/tour-guide-dashboard" element={
                <ProtectedStaffRoute allowedRoles={['tour_guide']}>
                  <TourGuideDashboard />
                </ProtectedStaffRoute>
              } />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            </Routes>
            <ChatbotWrapper />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
