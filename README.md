## Configuration Management

Sensitive configuration (such as Firebase API keys) is managed using environment variables. Copy `.env.example` to `.env` and fill in your own credentials. Never commit your real `.env` file to version control.

## Tooling & AI Integration

- **React** for UI
- **Ant Design** for components
- **Firebase** for authentication and database
- **Google AI** (and optionally Microsoft, if added) for authentication
- **OpenAI/Azure OpenAI** for AI-powered features (see `src/utils/Config.jsx`)
- **Jest** and **React Testing Library** for tests (see `/tests`)

AI models are integrated via API endpoints, and their configuration is managed in `src/utils/Config.jsx`.

## Running Tests

To run tests:

```
npm test
```

## Security Best Practices

- All sensitive config is loaded from environment variables.
- User input is validated and sanitized.
- Error and event logging is implemented for traceability.
- Dependencies should be audited regularly for vulnerabilities. 