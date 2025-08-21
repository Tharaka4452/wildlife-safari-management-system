import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { bookingApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditProfileModal from '../components/EditProfileModal';
import UserContactMessages from '../components/UserContactMessages';
import AddReviewModal from '../components/AddReviewModal';
import { reviewApi } from '../services/api';


const UserAccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [showReviewForBookingId, setShowReviewForBookingId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [showAlreadyReviewedMessage, setShowAlreadyReviewedMessage] = useState(false);

  
  // Pagination states
  const [currentReviewsPage, setCurrentReviewsPage] = useState(1);
  const [currentBookingsPage, setCurrentBookingsPage] = useState(1);
  const [reviewsPerPage] = useState(10);
  const [bookingsPerPage] = useState(10);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const handleViewBookings = useCallback(async () => {
    if (showBookings) {
      setShowBookings(false);
      return;
    }
    
    setShowBookings(true);
    setLoadingBookings(true);
    setBookingsError(null);
    
    try {
      const response = await bookingApi.getUserBookings();
      if (response.success) {
        setBookings(response.bookings);
      } else {
        setBookingsError(response.message || t('userAccount.errors.failedToLoadBookings'));
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingsError(`${t('userAccount.errors.failedToLoadBookings')}. ${t('userAccount.errors.pleaseTryAgain')}`);
    } finally {
      setLoadingBookings(false);
    }
  }, [showBookings, t]);

  // Fetch bookings when component mounts if user has any
  useEffect(() => {
    const checkBookings = async () => {
      try {
        const response = await bookingApi.getUserBookings();
        if (response.success && response.bookings.length > 0) {
          setBookings(response.bookings);
        }
      } catch (error) {
        console.error('Error checking initial bookings:', error);
      }
    };
    
    checkBookings();
  }, []);

  // Ensure user reviews are available for button state in bookings list
  useEffect(() => {
    loadUserReviews();
  }, []);

  // Load bookings when bookings tab is selected
  useEffect(() => {
    if (activeTab === 'bookings' && bookings.length === 0) {
      handleViewBookings();
    }
  }, [activeTab, bookings.length, handleViewBookings]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'bookings') {
      setCurrentBookingsPage(1);
      if (bookings.length === 0) {
        handleViewBookings();
      }
    }
    if (tab === 'reviews') {
      setCurrentReviewsPage(1);
      loadUserReviews();
    }
  };

  const loadUserReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await reviewApi.getUserReviews();
      if (response.reviews) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error('Error loading user reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkIfAlreadyReviewed = (bookingId) => {
    return reviews.some(review => review.bookingId === bookingId);
  };

  const handleAddReview = (bookingId) => {
    if (checkIfAlreadyReviewed(bookingId)) {
      setShowAlreadyReviewedMessage(true);
      // Hide message after 3 seconds
      setTimeout(() => setShowAlreadyReviewedMessage(false), 3000);
      return;
    }
    setShowReviewForBookingId(bookingId);
  };

  // Pagination functions for reviews
  const indexOfLastReview = currentReviewsPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalReviewsPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleReviewsPageChange = (pageNumber) => {
    setCurrentReviewsPage(pageNumber);
  };

  // Pagination functions for bookings
  const indexOfLastBooking = currentBookingsPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalBookingsPages = Math.ceil(bookings.length / bookingsPerPage);

  const handleBookingsPageChange = (pageNumber) => {
    setCurrentBookingsPage(pageNumber);
  };





  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-800/50"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-repeat bg-center" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>
      </div>
      
      <Header />
      
             {/* Main Content */}
       <div className="pt-24 pb-16 relative z-10">
         <div className="container mx-auto px-6">
           {/* Page Header */}
           <div className="text-center mb-12">
             <h1 className="text-4xl md:text-5xl font-abeze font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 mb-4 animate-fade-in">
               {t('userAccount.pageTitle')}
             </h1>
             <p className="text-slate-300 font-abeze text-lg opacity-90">
               {t('userAccount.pageSubtitle')}
             </p>
           </div>

          {/* Account Content */}
          <div className="max-w-4xl mx-auto">
                         {/* Tab Navigation */}
             <div className="flex flex-wrap justify-center mb-8 bg-gray-800/80 backdrop-blur-xl rounded-3xl p-3 border border-gray-700/50 shadow-2xl">
                             <button
                 onClick={() => handleTabChange('profile')}
                 className={`px-8 py-4 rounded-2xl font-abeze font-medium transition-all duration-500 transform hover:scale-105 ${
                   activeTab === 'profile'
                     ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                     : 'text-slate-300 hover:text-white hover:bg-emerald-600/20'
                 }`}
               >
                 {t('userAccount.tabs.profile')}
               </button>
                             <button
                 onClick={() => handleTabChange('bookings')}
                 className={`px-8 py-4 rounded-2xl font-abeze font-medium transition-all duration-500 transform hover:scale-105 ${
                   activeTab === 'bookings'
                     ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                     : 'text-slate-300 hover:text-white hover:bg-emerald-600/20'
                 }`}
               >
                 {t('userAccount.tabs.bookings')}
               </button>
               <button
                 onClick={() => handleTabChange('messages')}
                 className={`px-8 py-4 rounded-2xl font-abeze font-medium transition-all duration-500 transform hover:scale-105 ${
                   activeTab === 'messages'
                     ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                     : 'text-slate-300 hover:text-white hover:bg-emerald-600/20'
                 }`}
               >
                 {t('userAccount.tabs.messages')}
               </button>
               <button
                 onClick={() => handleTabChange('reviews')}
                 className={`px-8 py-4 rounded-2xl font-abeze font-medium transition-all duration-500 transform hover:scale-105 ${
                   activeTab === 'reviews'
                     ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                     : 'text-slate-300 hover:text-white hover:bg-emerald-600/20'
                 }`}
               >
                 {t('userAccount.myReviews')}
               </button>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <div className="grid md:grid-cols-3 gap-8">
                                 {/* Profile Card */}
                 <div className="md:col-span-1">
                   <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 transform hover:scale-[1.02]">
                                         <div className="text-center mb-6">
                       <div className="relative w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden border-4 border-gradient-to-r from-emerald-400 to-green-500 p-1">
                                                 <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
                           {user?.profilePicture?.url ? (
                             <img 
                               src={user.profilePicture.url} 
                               alt={t('userAccount.common.profileImageAlt')} 
                               className="w-full h-full object-cover"
                             />
                           ) : (
                             <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 flex items-center justify-center">
                               <span className="text-2xl font-abeze font-bold text-white">
                                 {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                               </span>
                             </div>
                           )}
                         </div>
                         {/* Online indicator */}
                         <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                      </div>
                                             <h2 className="text-2xl font-abeze font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 mb-2">
                         {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || t('userAccount.common.defaultUser')}
                       </h2>
                       <p className="text-slate-400 font-abeze text-sm">
                         {user?.email}
                       </p>
                    </div>

                                         <div className="space-y-4">
                       <button
                         onClick={handleEditProfile}
                         className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-abeze font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                       >
                         {t('userAccount.profile.editProfile')}
                       </button>
                       <button
                         onClick={handleLogout}
                         className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-abeze font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                       >
                         {t('userAccount.profile.logout')}
                       </button>
                     </div>
                  </div>
                </div>

                                 {/* Account Details */}
                 <div className="md:col-span-2">
                   <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                     <h3 className="text-2xl font-abeze font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 mb-8">
                       {t('userAccount.profile.accountInformation')}
                     </h3>
                    
                                         <div className="grid md:grid-cols-2 gap-6">
                       <div className="group">
                         <label className="block text-slate-300 font-abeze font-medium mb-3 text-sm uppercase tracking-wider">
                           {t('userAccount.profile.firstName')}
                         </label>
                         <div className="bg-gray-700/50 border border-gray-600/50 rounded-2xl px-6 py-4 text-white font-abeze group-hover:border-emerald-400/30 transition-all duration-300">
                           {user?.firstName || t('userAccount.profile.notProvided')}
                         </div>
                       </div>

                                             <div className="group">
                         <label className="block text-slate-300 font-abeze font-medium mb-3 text-sm uppercase tracking-wider">
                           {t('userAccount.profile.lastName')}
                         </label>
                         <div className="bg-gray-700/50 border border-gray-600/50 rounded-2xl px-6 py-4 text-white font-abeze group-hover:border-emerald-400/30 transition-all duration-300">
                           {user?.lastName || t('userAccount.profile.notProvided')}
                         </div>
                       </div>

                       <div className="group">
                         <label className="block text-slate-300 font-abeze font-medium mb-3 text-sm uppercase tracking-wider">
                           {t('userAccount.profile.emailAddress')}
                         </label>
                         <div className="bg-gray-700/50 border border-gray-600/50 rounded-2xl px-6 py-4 text-white font-abeze group-hover:border-emerald-400/30 transition-all duration-300">
                           {user?.email}
                         </div>
                       </div>

                       <div className="group">
                         <label className="block text-slate-300 font-abeze font-medium mb-3 text-sm uppercase tracking-wider">
                           {t('userAccount.profile.phoneNumber')}
                         </label>
                         <div className="bg-gray-700/50 border border-gray-600/50 rounded-2xl px-6 py-4 text-white font-abeze group-hover:border-emerald-400/30 transition-all duration-300">
                           {user?.phone || t('userAccount.profile.notProvided')}
                         </div>
                       </div>

                       <div className="group">
                         <label className="block text-slate-300 font-abeze font-medium mb-3 text-sm uppercase tracking-wider">
                           {t('userAccount.profile.country')}
                         </label>
                         <div className="bg-gray-700/50 border border-gray-600/50 rounded-2xl px-6 py-4 text-white font-abeze group-hover:border-emerald-400/30 transition-all duration-300">
                           {user?.country || t('userAccount.profile.notProvided')}
                         </div>
                       </div>

                       <div className="group">
                         <label className="block text-slate-300 font-abeze font-medium mb-3 text-sm uppercase tracking-wider">
                           {t('userAccount.profile.memberSince')}
                         </label>
                         <div className="bg-gray-700/50 border border-gray-600/50 rounded-2xl px-6 py-4 text-white font-abeze group-hover:border-emerald-400/30 transition-all duration-300">
                           {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('userAccount.profile.recentlyJoined')}
                         </div>
                       </div>
                     </div>
                  </div>

                  
                </div>
              </div>
            )}

            {/* Messages Tab Content */}
            {activeTab === 'messages' && (
              <UserContactMessages userEmail={user?.email} />
            )}

                         {/* Reviews Tab Content */}
             {activeTab === 'reviews' && (
               <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                 <h3 className="text-2xl font-abeze font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 mb-8">
                   {t('userAccount.myReviews')}
                 </h3>
                
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 font-abeze">{t('userAccount.loadingReviews')}</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <p className="text-gray-300 font-abeze mb-4">{t('userAccount.noReviewsYet')}</p>
                    <p className="text-gray-400 font-abeze text-sm">{t('userAccount.completeBookingToReview')}</p>
                  </div>
                ) : (
                                     <div className="space-y-6">
                     {currentReviews.map((review, index) => (
                       <div 
                         key={review._id} 
                         className="group bg-gray-800/60 rounded-xl p-6 border border-gray-700/50 hover:border-green-400/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                         style={{ animationDelay: `${index * 100}ms` }}
                       >
                         <div className="flex flex-col md:flex-row gap-6">
                           <div className="flex-1">
                             <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center space-x-3">
                                 <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                 <h4 className="text-xl font-abeze font-bold text-white group-hover:text-green-300 transition-colors duration-200">
                                   {review.packageId?.title || t('userAccount.defaultPackageTitle')}
                                 </h4>
                               </div>
                               <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full border border-white/20">
                                 <div className="flex items-center space-x-1">
                                   {[...Array(5)].map((_, i) => (
                                     <svg
                                       key={i}
                                       className={`w-4 h-4 ${
                                         i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                                       }`}
                                       fill="currentColor"
                                       viewBox="0 0 20 20"
                                     >
                                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                     </svg>
                                   ))}
                                 </div>
                                 <span className="text-white font-abeze font-semibold text-sm">{review.rating}/5</span>
                               </div>
                             </div>
                             
                             {review.comment && (
                               <div className="mb-4 p-4 bg-white/5 rounded-lg border-l-4 border-green-400/50">
                                 <p className="text-gray-200 font-abeze italic leading-relaxed">"{review.comment}"</p>
                               </div>
                             )}
                             
                             <div className="flex items-center space-x-4 text-sm">
                               <div className="flex items-center space-x-2 text-gray-300">
                                 <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                 </svg>
                                 <span className="font-abeze">{t('userAccount.reviews.reviewedOn')} {new Date(review.createdAt).toLocaleDateString()}</span>
                               </div>
                               <div className="flex items-center space-x-2 text-gray-300">
                                 <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                 </svg>
                                 <span className="font-abeze">{t('userAccount.reviews.booking')} {review.bookingId?.slice(-8) || t('userAccount.common.notAvailable')}</span>
                               </div>
                               {review.images && review.images.length > 0 && (
                                 <div className="flex items-center space-x-2 text-gray-300">
                                   <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                                   </svg>
                                   <span className="font-abeze">{review.images.length} {review.images.length !== 1 ? t('userAccount.reviews.photosPlural') : t('userAccount.reviews.photos')}</span>
                                 </div>
                               )}
                             </div>
                           </div>
                           
                           {review.images && review.images.length > 0 && (
                             <div className="flex flex-col space-y-2">
                               <p className="text-green-200 font-abeze font-medium text-sm text-center">{t('userAccount.yourPhotos')}</p>
                               <div className="grid grid-cols-2 gap-2">
                                 {review.images.map((image, index) => (
                                   <div key={index} className="relative group/image">
                                     <img
                                       src={image.url}
                                       alt={`Review ${index + 1}`}
                                       className="w-24 h-24 object-cover rounded-lg border-2 border-white/20 group-hover/image:border-green-400/50 transition-all duration-200 cursor-pointer hover:scale-105"
                                       onClick={() => {
                                         // Optional: Add image modal here
                                       }}
                                     />
                                     <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                       <svg className="w-6 h-6 text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                       </svg>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                       </div>
                     ))}
                     
                     {/* Reviews Pagination */}
                     {totalReviewsPages > 1 && (
                       <div className="mt-8 flex justify-center">
                         <div className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-md rounded-xl p-2 border border-gray-700/50">
                           <button
                             onClick={() => handleReviewsPageChange(currentReviewsPage - 1)}
                             disabled={currentReviewsPage === 1}
                             className="px-3 py-2 rounded-full font-abeze font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white hover:bg-white/20"
                           >
                             {t('userAccount.reviews.previous')}
                           </button>
                           
                           {[...Array(totalReviewsPages)].map((_, index) => {
                             const pageNumber = index + 1;
                             return (
                               <button
                                 key={pageNumber}
                                 onClick={() => handleReviewsPageChange(pageNumber)}
                                 className={`px-3 py-2 rounded-full font-abeze font-medium transition-all duration-300 ${
                                   currentReviewsPage === pageNumber
                                     ? 'bg-green-600 text-white'
                                     : 'text-gray-300 hover:text-white hover:bg-white/20'
                                 }`}
                               >
                                 {pageNumber}
                               </button>
                             );
                           })}
                           
                           <button
                             onClick={() => handleReviewsPageChange(currentReviewsPage + 1)}
                             disabled={currentReviewsPage === totalReviewsPages}
                             className="px-3 py-2 rounded-full font-abeze font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white hover:bg-white/20"
                           >
                             {t('userAccount.reviews.next')}
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                )}
              </div>
            )}

                         {/* Bookings Tab Content */}
             {activeTab === 'bookings' && (
               <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                 <h3 className="text-2xl font-abeze font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 mb-8">
                   {t('userAccount.bookings.title')}
                 </h3>
                
                {loadingBookings ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 font-abeze">{t('userAccount.bookings.loading')}</p>
                  </div>
                ) : bookingsError ? (
                  <div className="text-center py-8">
                    <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-red-400 font-abeze mb-4">{bookingsError}</p>
                    <button
                      onClick={handleViewBookings}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full font-abeze font-medium transition-all duration-300"
                    >
                      {t('userAccount.bookings.tryAgain')}
                    </button>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-gray-300 font-abeze mb-4">{t('userAccount.bookings.noBookings')}</p>
                    <button
                      onClick={() => navigate('/travel-packages')}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full font-abeze font-medium transition-all duration-300"
                    >
                      {t('userAccount.bookings.bookFirstSafari')}
                    </button>
                  </div>
                                 ) : (
                   <div className="space-y-6">
                     {currentBookings.map((booking) => (
                       <div key={booking._id} className="bg-gray-800/60 rounded-lg p-6 border border-gray-700/50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-abeze font-bold text-white mb-3">
                              {booking.packageDetails?.title || t('userAccount.defaultPackageTitle')}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div>
                                <span className="text-gray-300 font-abeze font-medium">{t('userAccount.bookings.location')}</span>
                                <p className="text-white font-abeze">{booking.packageDetails?.location || t('userAccount.common.notAvailable')}</p>
                              </div>
                              <div>
                                <span className="text-gray-300 font-abeze font-medium">{t('userAccount.bookings.duration')}</span>
                                <p className="text-white font-abeze">{booking.packageDetails?.duration || t('userAccount.common.notAvailable')}</p>
                              </div>
                              <div>
                                <span className="text-gray-300 font-abeze font-medium">{t('userAccount.bookings.people')}</span>
                                <p className="text-white font-abeze">{booking.bookingDetails?.numberOfPeople || t('userAccount.common.notAvailable')}</p>
                              </div>
                              <div>
                                <span className="text-gray-300 font-abeze font-medium">{t('userAccount.bookings.totalPrice')}</span>
                                <p className="text-white font-abeze font-bold">LKR {booking.totalPrice?.toLocaleString() || t('userAccount.common.notAvailable')}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-300 font-abeze font-medium">{t('userAccount.bookings.startDate')}</span>
                                <p className="text-white font-abeze">
                                  {booking.bookingDetails?.startDate ? new Date(booking.bookingDetails.startDate).toLocaleDateString() : t('userAccount.common.notAvailable')}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-300 font-abeze font-medium">{t('userAccount.bookings.endDate')}</span>
                                <p className="text-white font-abeze">
                                  {booking.bookingDetails?.endDate ? new Date(booking.bookingDetails.endDate).toLocaleDateString() : t('userAccount.common.notAvailable')}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-300 font-abeze font-medium">{t('userAccount.bookings.status')}</span>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-abeze font-medium ${
                                  booking.status === 'Payment Confirmed' ? 'bg-green-600/20 text-green-400 border border-green-400/30' :
                                  booking.status === 'Confirmed' ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30' :
                                  booking.status === 'In Progress' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-400/30' :
                                  booking.status === 'Completed' ? 'bg-purple-600/20 text-purple-400 border border-purple-400/30' :
                                  'bg-gray-600/20 text-gray-400 border border-gray-400/30'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-300 font-abeze font-medium">{t('userAccount.bookings.payment')}</span>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-abeze font-medium ${
                                  booking.payment ? 'bg-green-600/20 text-green-400 border border-green-400/30' : 'bg-red-600/20 text-red-400 border border-red-400/30'
                                }`}>
                                  {booking.payment ? t('userAccount.bookings.paid') : t('userAccount.bookings.pending')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="md:ml-6">
                                                         {booking.status === 'Completed' && (
                               <button
                                 onClick={() => handleAddReview(booking._id)}
                                 className={`group relative px-6 py-3 rounded-xl font-abeze font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border ${
                                   checkIfAlreadyReviewed(booking._id)
                                     ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed border-gray-400/30'
                                     : 'bg-green-600 hover:bg-green-700 border-green-400/30'
                                 }`}
                                 disabled={checkIfAlreadyReviewed(booking._id)}
                               >
                                 <div className="flex items-center space-x-2">
                                   {checkIfAlreadyReviewed(booking._id) ? (
                                     <>
                                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                       </svg>
                                       <span>Already Reviewed</span>
                                     </>
                                   ) : (
                                     <>
                                       <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                       </svg>
                                       <span>Share Your Experience</span>
                                     </>
                                   )}
                                 </div>
                                 {!checkIfAlreadyReviewed(booking._id) && (
                                   <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                 )}
                               </button>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Bookings Pagination */}
                    {totalBookingsPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
                                                     <button
                             onClick={() => handleBookingsPageChange(currentBookingsPage - 1)}
                             disabled={currentBookingsPage === 1}
                             className="px-3 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-green-200 hover:text-white hover:bg-white/10"
                           >
                             {t('userAccount.bookings.previous')}
                           </button>
                          
                          {[...Array(totalBookingsPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handleBookingsPageChange(pageNumber)}
                                className={`px-3 py-2 rounded-full font-abeze font-medium transition-all duration-300 ${
                                  currentBookingsPage === pageNumber
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-white/20'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => handleBookingsPageChange(currentBookingsPage + 1)}
                            disabled={currentBookingsPage === totalBookingsPages}
                            className="px-3 py-2 rounded-full font-abeze font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white hover:bg-white/20"
                          >
                            {t('userAccount.bookings.next')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal 
          onClose={handleCloseEditProfile}
          user={user}
        />
      )}

             {/* Add Review Modal */}
       {showReviewForBookingId && (
         <AddReviewModal
           onClose={() => setShowReviewForBookingId(null)}
           onSubmit={async ({ rating, comment, files }) => {
             const formData = new FormData();
             formData.append('rating', String(rating));
             formData.append('comment', comment || '');
             (files || []).forEach((f) => formData.append('images', f));
             await reviewApi.createReview(showReviewForBookingId, formData);
             setShowReviewForBookingId(null);
             setShowReviewSuccess(true);
             // Refresh user reviews so booking buttons update immediately
             loadUserReviews();
             // Hide success message after 3 seconds
             setTimeout(() => setShowReviewSuccess(false), 3000);
           }}
         />
       )}

       {/* Review Success Message */}
       {showReviewSuccess && (
         <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
           <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-400/30">
             <div className="flex items-center space-x-3">
               <div className="animate-bounce">
                 <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 </svg>
               </div>
               <div>
                 <h4 className="font-abeze font-bold text-lg">{t('userAccount.reviews.reviewSubmitted')}</h4>
                 <p className="text-green-200 text-sm">{t('userAccount.reviews.thankYouMessage')}</p>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Already Reviewed Message */}
       {showAlreadyReviewedMessage && (
         <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
           <div className="bg-gradient-to-r from-blue-600/20 to-blue-400/20 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-2xl border border-blue-400/30">
             <div className="flex items-center space-x-3">
               <div className="animate-pulse">
                 <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div>
                 <h4 className="font-abeze font-bold text-lg">{t('userAccount.reviews.alreadyReviewedTitle')}</h4>
                 <p className="text-blue-200 text-sm">{t('userAccount.reviews.alreadyReviewedMessage')}</p>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default UserAccountPage;
