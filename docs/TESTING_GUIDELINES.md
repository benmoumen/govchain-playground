# Testing Guidelines

## Overview

This document outlines the testing strategy for the Digital Wallet Playground project.

## Testing Stack

- Jest - Main testing framework
- React Testing Library - Component testing
- MSW (Mock Service Worker) - API mocking
- Cypress - End-to-end testing
- Playwright - Cross-browser testing (alternative to Cypress)

## Testing Levels

### 1. Unit Tests

- Test individual functions and components in isolation
- Focus on `src/lib/`, `src/utils/`, and simple components
- Aim for >80% coverage for utility functions

### 2. Integration Tests

- Test component interactions
- Focus on complex components and context providers
- Test API integration points
- Verify form submissions and state updates

### 3. E2E Tests

- Test critical user flows
- Focus on main features:
  - Wallet download process
  - Credential issuance
  - Verification flows
  - Connection establishment

## Best Practices

1. Follow AAA pattern (Arrange, Act, Assert)
2. Use meaningful test descriptions
3. Mock external dependencies
4. Test error scenarios
5. Keep tests maintainable and readable
6. Use test-data-\* attributes for component testing

## File Structure

```
__tests__/
├── unit/
│   ├── lib/
│   └── components/
├── integration/
│   ├── api/
│   └── features/
└── e2e/
    └── flows/
```

## Running Tests

```bash
# Unit and integration tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```
