# Testing TODO List

## Setup Tasks

- [x] Install and configure Jest
- [x] Set up React Testing Library
- [x] Configure MSW for API mocking
- [ ] Set up Cypress/Playwright for E2E testing
- [x] Configure coverage reporting
- [x] Add test scripts to package.json
- [ ] Set up GitHub Actions for CI testing

## Unit Tests

### Utils & Helpers

- [x] Test `src/lib/utils.ts` functions
  - [x] `createLongLivingCookieOptions`
  - [x] `isValidUUIDv4`
  - [x] `generateRandomIDDocumentNumber`
  - [x] `getRandomElement`
- [x] Test `src/lib/vc.ts` functions
  - [x] `getActiveConnectionCookieName`
  - [x] `generateNonce`
  - [x] `extractAttributesFromPresentation`

### Components

- [ ] Test UI components
  - [ ] `SiteHeader`
  - [ ] `Button` variants
  - [ ] `CredentialForm`
  - [ ] `VCConnectionCard`
- [ ] Test icons and visual elements

## Integration Tests

### API Routes

- [ ] Test `/api/ai/route.ts`
  - [ ] Authentication
  - [ ] Request validation
  - [ ] Error handling
- [ ] Test `/api/vc/[case]/connection/route.ts`
- [ ] Test `/api/vc/[case]/credential/route.ts`

### Features

- [ ] Test VC context provider
- [ ] Test theme provider
- [ ] Test form submissions
- [ ] Test API integrations
- [ ] Test navigation flows

## E2E Tests

### Critical Flows

- [ ] Wallet download process
- [ ] Credential issuance flow
- [ ] Verification process
- [ ] Connection establishment
- [ ] Theme switching
- [ ] Navigation and routing

### Cross-browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Documentation

- [ ] Document test patterns and examples
- [ ] Add comments for complex test scenarios
- [ ] Create testing cheatsheet for contributors
- [ ] Document mocking strategies

## CI/CD Integration

- [ ] Add test running to CI pipeline
- [ ] Configure test coverage thresholds
- [ ] Set up test reporting
- [ ] Add status badges to README.md

## Performance Testing

- [ ] Set up Lighthouse CI
- [ ] Add load testing for API routes
- [ ] Test PWA functionality
