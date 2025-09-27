# Contributing to Wildlife Safari Management System

Thank you for your interest in contributing to the Wildlife Safari Management System! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [INSERT CONTACT EMAIL].

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/wildlife-safari-management-system.git
   cd wildlife-safari-management-system
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/wildlife-safari-management-system.git
   ```

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug Reports**: Report bugs and issues
- **Feature Requests**: Suggest new features
- **Code Contributions**: Fix bugs or implement features
- **Documentation**: Improve documentation
- **Testing**: Add or improve tests
- **Translation**: Help with multi-language support

### Development Setup

1. **Install Dependencies**
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment template
   cd backend
   cp .env.example .env
   
   # Edit .env with your configuration
   # Required variables:
   # - MONGODB_URI
   # - JWT_SECRET
   # - STRIPE_SECRET_KEY
   # - CLOUDINARY_CLOUD_NAME
   # - CLOUDINARY_API_KEY
   # - CLOUDINARY_API_SECRET
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Coding Standards

### General Guidelines

- Follow existing code style and patterns
- Write clear, self-documenting code
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused

### Frontend (React)

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Use TypeScript when possible

### Backend (Node.js/Express)

- Use async/await for asynchronous operations
- Implement proper error handling middleware
- Validate input data
- Use environment variables for configuration
- Follow RESTful API conventions

### Database (MongoDB)

- Use Mongoose schemas for data validation
- Implement proper indexing
- Use transactions when needed
- Follow MongoDB best practices

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/your-bugfix-name
   ```

2. **Make Changes**
   - Write your code following our coding standards
   - Add tests if applicable
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   # Run linting
   cd frontend && npm run lint
   
   # Test backend endpoints
   cd backend && npm test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   # Use conventional commit messages:
   # feat: new feature
   # fix: bug fix
   # docs: documentation changes
   # style: formatting changes
   # refactor: code refactoring
   # test: adding tests
   # chore: maintenance tasks
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

### Pull Request Guidelines

- Provide a clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Request reviews from maintainers

## Issue Reporting

### Before Creating an Issue

1. Check existing issues to avoid duplicates
2. Ensure you're using the latest version
3. Try to reproduce the issue

### Bug Reports

When reporting bugs, please include:

- **Environment**: OS, Node.js version, browser
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Error Messages**: Full error logs

### Feature Requests

When requesting features, please include:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other ways to solve the problem
- **Additional Context**: Any other relevant information

## Development Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `docs/documentation-update` - Documentation changes
- `refactor/refactoring-description` - Code refactoring

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(auth): add JWT token refresh`
- `fix(booking): resolve payment validation issue`
- `docs(readme): update installation instructions`

## Testing

### Frontend Testing

```bash
cd frontend
npm run test
```

### Backend Testing

```bash
cd backend
npm test
```

## Release Process

1. Update version numbers in package.json files
2. Update CHANGELOG.md
3. Create a release tag
4. Deploy to production

## Getting Help

- **Documentation**: Check the README and code comments
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: [INSERT CONTACT INFORMATION]

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the Wildlife Safari Management System!
