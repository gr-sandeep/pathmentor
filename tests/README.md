# Test Coverage for PathMentor

## How to Run Tests

```
npm test
```

## Test Cases
- **Positive Cases:**
  - Valid login input enables the login button.
  - Google sign-in and email/password sign-in work as expected (mocked).
- **Negative Cases:**
  - Empty or invalid input disables the login button.
  - Invalid credentials show error messages.
- **Edge Cases:**
  - Excessively long input is rejected.
  - Input with only spaces is rejected.

## Notes
- Tests use React Testing Library and Jest.
- For full coverage, mock Firebase and external dependencies as needed. 