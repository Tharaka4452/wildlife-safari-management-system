# Wildlife Safari Management System

A modern React application for managing wildlife safari experiences.

## Features

### Authentication System
- **User Registration**: Complete signup form with validation
- **User Login**: Secure authentication with JWT tokens
- **User Account Page**: Profile management and account information
- **Protected Routes**: Secure access to user-specific pages
- **Logout Functionality**: Secure session termination

### User Experience
- **Automatic Redirects**: Users are redirected to homepage after login/signup
- **Dynamic Header**: Login button changes to "My Account" when authenticated
- **Account Management**: View and manage profile information
- **Session Persistence**: Login state persists across browser sessions

### Technical Features
- **Context API**: Global state management for authentication
- **Protected Routes**: Route protection for authenticated users
- **Form Validation**: Comprehensive client-side validation
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Beautiful, accessible design with Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure the backend server is running on `http://localhost:5000`

## Authentication Flow

1. **Registration**: Users can create accounts with email, password, and profile information
2. **Login**: Users authenticate with email and password
3. **Redirect**: After successful authentication, users are redirected to the homepage
4. **Account Access**: Click "My Account" in the header to access profile page
5. **Logout**: Users can log out from the account page

## File Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation with auth-aware login/account button
│   ├── Login.jsx           # Login modal with form validation
│   ├── Signup.jsx          # Registration modal with comprehensive validation
│   ├── ProtectedRoute.jsx  # Route protection component
│   └── ...
├── context/
│   └── AuthContext.jsx     # Global authentication state management
├── pages/
│   └── UserAccountPage.jsx # User profile and account management
├── services/
│   └── api.js             # API service with authentication helpers
└── App.jsx                # Main app with routing and auth provider
```

## API Integration

The frontend integrates with the backend API for:
- User registration (`POST /api/auth/register`)
- User login (`POST /api/auth/login`)
- Token management and storage
- Automatic token inclusion in API requests

## Security Features

- JWT token-based authentication
- Secure token storage in localStorage
- Protected routes for authenticated content
- Automatic token inclusion in API requests
- Session persistence across browser sessions
