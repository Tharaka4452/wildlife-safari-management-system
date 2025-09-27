# Wildlife Safari Management System

A comprehensive full-stack web application for managing wildlife safari operations, bookings, staff, vehicles, and donations. This system provides a complete solution for safari park management with features for administrators, staff members, and visitors.

## Features

- **User Management**: Registration, authentication, and profile management
- **Safari Package Management**: Create, edit, and manage safari packages
- **Booking System**: Online booking with payment integration (Stripe)
- **Staff Management**: Staff registration, attendance tracking, and payroll management
- **Vehicle Management**: Vehicle assignment and tracking
- **Donation System**: Accept and manage donations
- **Multi-language Support**: English, Sinhala, and Tamil
- **Admin Dashboard**: Comprehensive admin panel for system management
- **Staff Dashboards**: Specialized dashboards for drivers and tour guides
- **Review System**: Customer feedback and rating system
- **Contact Management**: Handle customer inquiries and messages

## Tech Stack

### Frontend
- React 19.1.1
- React Router DOM 7.8.0
- Tailwind CSS 4.1.11
- Framer Motion 12.23.12
- Axios 1.11.0
- Recharts 2.15.4
- jsPDF 2.5.1

### Backend
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.17.1
- JWT Authentication
- Stripe Payment Integration
- Cloudinary Image Storage
- Nodemailer Email Service
- PDF Generation with PDFKit

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Stripe Account (for payments)
- Cloudinary Account (for image storage)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/wildlife-safari-management-system.git
cd wildlife-safari-management-system
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup
```bash
# Backend environment variables
cd backend
cp .env.example .env
# Edit .env with your configuration
```

4. Start the application
```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd frontend
npm run dev
```

## Project Structure

```
wildlife-safari-management-system/
├── backend/                 # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Utility scripts
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API services
│   │   ├── translations/  # Multi-language support
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── docs/                  # Documentation
```

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please contact us through our [Contact Form](https://your-website.com/contact) or create an issue in this repository.

## Acknowledgments

- Wildlife conservation organizations
- Safari park management teams
- Open source community contributors
