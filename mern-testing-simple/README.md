# Simple MERN Testing Project

A simplified MERN stack application demonstrating comprehensive testing strategies.

## Testing Strategy

### Unit Tests (70%+ Coverage)
- React components (User, Login, ErrorBoundary)
- Utility functions (helpers)
- Express controllers and middleware

### Integration Tests
- API endpoints with database operations
- Complete user CRUD flows

### E2E Tests
- Critical user flows with Cypress
- Form validation and user interactions

## Running Tests

```bash
# Install dependencies
npm run install-all

# Run all tests
npm test

# Run unit tests with coverage
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e