# Contributing

Thank you for helping improve the Tamic Group Trading Platform.

## Development workflow

1. Create a focused branch from `main`.
2. Keep each change limited to one clear concern.
3. Avoid committing generated files, local environment files, credentials, or service-role keys.
4. Run the complete validation pipeline before opening a pull request:

   ```bash
   npm ci
   npm run check
   ```

5. Explain the problem, approach, trade-offs, and validation performed in the pull-request description.

## Commit messages

Use short, imperative messages that describe the intent of the change.

Examples:

```text
Add validation for withdrawal requests
Extract KYC review state into a reusable hook
Prevent duplicate internal-transfer submissions
Document Supabase authorisation boundaries
```

Avoid generic messages such as `update`, `changes`, or `fix stuff`.

## Pull-request checklist

- [ ] The change has a clear and limited purpose.
- [ ] Type-checking passes with `npm run typecheck`.
- [ ] Linting passes with `npm run lint`.
- [ ] The production build passes with `npm run build`.
- [ ] New environment variables are documented in `.env.example`.
- [ ] No credentials, personal data, or privileged keys are included.
- [ ] Security-sensitive behaviour is enforced server-side rather than trusted to the browser.
- [ ] User-facing or architectural changes are documented where appropriate.

## Security-sensitive changes

Changes involving balances, withdrawals, KYC documents, roles, permissions, or administrative actions require extra care. UI checks are not sufficient authorisation. Review the corresponding Row Level Security policies, storage policies, database functions, and Edge Functions before considering the change complete.
