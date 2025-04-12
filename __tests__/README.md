# Testing Structure

This directory contains all the tests for the Digital Wallet Playground project. The tests are organized according to the testing guidelines outlined in `docs/TESTING_GUIDELINES.md`.

## Directory Structure

```
__tests__/
├── unit/                  # Unit tests for isolated components and functions
│   ├── lib/               # Tests for utility functions
│   └── components/        # Tests for UI components
├── integration/           # Integration tests for connected components
│   ├── api/               # Tests for API routes
│   └── features/          # Tests for feature workflows
└── e2e/                   # End-to-end tests
    └── flows/             # Tests for user flows
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (useful during development)
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run E2E tests (when implemented)
pnpm test:e2e
```

## Test Coverage

We aim for >80% coverage for utility functions and critical components. You can check the current coverage by running `pnpm test:coverage`.

## Writing Tests

### Unit Tests

- Test individual functions and components in isolation
- Mock external dependencies
- Focus on testing behavior, not implementation details

### Integration Tests

- Test how components interact with each other
- Test API routes with mocked services
- Verify state updates and data flow

### E2E Tests

- Test critical user flows from end to end
- Focus on user interactions and outcomes
- Use Cypress/Playwright for browser testing
