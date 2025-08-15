import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditProfileModal from '../components/EditProfileModal';

const UserAccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    // Page load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Stats animation delay
    const statsTimer = setTimeout(() => {
      setAnimateStats(true);
    }, 800);

    // Counting animation
    const countTimer = setTimeout(() => {
      const counters = document.querySelectorAll('[data-target]');
      counters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        // Add a small delay for each counter to create a staggered effect
        setTimeout(() => {
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.floor(current);
              // Add a subtle glow effect during counting
              counter.style.textShadow = '0 0 10px rgba(34, 197, 94, 0.5)';
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
              // Remove glow effect when counting is complete
              counter.style.textShadow = 'none';
              // Add completion indicator
              const completionIndicator = document.createElement('div');
              completionIndicator.className = 'w-2 h-2 bg-green-400 rounded-full animate-bounce ml-2';
              completionIndicator.style.animationDelay = '0.5s';
              counter.parentElement.appendChild(completionIndicator);
            }
          };
          
          updateCounter();
        }, index * 200); // Stagger each counter by 200ms
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(statsTimer);
      clearTimeout(countTimer);
    };
  }, []);

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

  const handleViewBookings = () => {
    // TODO: Implement view bookings functionality
    console.log('View bookings clicked');
  };

  // Mock data for demonstration
  const userStats = {
    totalBookings: 3,
    completedTrips: 2,
    upcomingTrips: 1,
    loyaltyPoints: 450
  };

  const recentBookings = [
    { id: 1, package: 'Elephant Safari Adventure', date: '2024-02-15', status: 'completed' },
    { id: 2, package: 'Wildlife Photography Tour', date: '2024-03-20', status: 'upcoming' },
    { id: 3, package: 'Bird Watching Expedition', date: '2024-01-10', status: 'completed' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'upcoming': return 'Upcoming';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a23] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>

      <Header />
      
      {/* Main Content */}
      <div className={`pt-24 pb-16 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className={`relative inline-block mb-6 transition-all duration-1000 delay-500 ${isLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
                {user?.profilePicture?.url ? (
                  <img 
                    src={user.profilePicture.url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <span className="text-4xl font-abeze font-bold text-white">
                      {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className={`text-5xl md:text-6xl font-abeze font-bold text-white mb-4 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Welcome back, <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-pulse">{user?.firstName || 'Adventurer'}</span>!
            </h1>
            <p className={`text-green-200 font-abeze text-xl max-w-2xl mx-auto transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Ready for your next wildlife adventure? Let's explore your account and plan your next safari experience.
            </p>
          </div>

                     {/* Stats Cards */}
           <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-1100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${animateStats ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0ms' }}>
              <div className="flex items-center justify-between">
                                 <div>
                   <p className="text-green-200 font-abeze text-sm">Total Bookings</p>
                   <div className="flex items-center space-x-2">
                     <p className={`text-3xl font-abeze font-bold text-white transition-all duration-1000 ${animateStats ? 'animate-count-up' : ''}`} data-target={userStats.totalBookings}>0</p>
                     {animateStats && (
                       <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                     )}
                   </div>
                 </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${animateStats ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                                 <div>
                   <p className="text-green-200 font-abeze text-sm">Completed Trips</p>
                   <div className="flex items-center space-x-2">
                     <p className={`text-3xl font-abeze font-bold text-white transition-all duration-1000 ${animateStats ? 'animate-count-up' : ''}`} data-target={userStats.completedTrips}>0</p>
                     {animateStats && (
                       <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                     )}
                   </div>
                 </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${animateStats ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between">
                                 <div>
                   <p className="text-green-200 font-abeze text-sm">Upcoming Trips</p>
                   <div className="flex items-center space-x-2">
                     <p className={`text-3xl font-abeze font-bold text-white transition-all duration-1000 ${animateStats ? 'animate-count-up' : ''}`} data-target={userStats.upcomingTrips}>0</p>
                     {animateStats && (
                       <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                     )}
                   </div>
                 </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            
          </div>

          {/* Main Content Grid */}
          <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-1000 delay-1300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Left Sidebar - Profile & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <h3 className="text-2xl font-abeze font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-abeze font-medium">
                        {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'User'}
                      </p>
                      <p className="text-green-200 text-sm font-abeze">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-abeze font-medium">Phone</p>
                      <p className="text-green-200 text-sm font-abeze">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-abeze font-medium">Country</p>
                      <p className="text-green-200 text-sm font-abeze">{user?.country || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleEditProfile}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-abeze font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-abeze font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              
            </div>

            {/* Right Content - Recent Bookings & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Bookings */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-abeze font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Recent Bookings
                  </h3>
                  <button
                    onClick={handleViewBookings}
                    className="text-green-400 hover:text-green-300 font-abeze font-medium transition-colors duration-300"
                  >
                    View All →
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-abeze font-semibold text-lg mb-2">
                            {booking.package}
                          </h4>
                          <p className="text-green-200 font-abeze text-sm">
                            {new Date(booking.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-abeze font-medium ${getStatusColor(booking.status)} text-white`}>
                            {getStatusText(booking.status)}
                          </span>
                          <button className="text-green-400 hover:text-green-300 transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <h3 className="text-2xl font-abeze font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Account Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-200 font-abeze font-medium mb-2">
                      First Name
                    </label>
                    <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                      {user?.firstName || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-green-200 font-abeze font-medium mb-2">
                      Last Name
                    </label>
                    <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                      {user?.lastName || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-green-200 font-abeze font-medium mb-2">
                      Email Address
                    </label>
                    <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-green-200 font-abeze font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                      {user?.phone || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-green-200 font-abeze font-medium mb-2">
                      Country
                    </label>
                    <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                      {user?.country || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-green-200 font-abeze font-medium mb-2">
                      Member Since
                    </label>
                    <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Recently joined'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default UserAccountPage;
