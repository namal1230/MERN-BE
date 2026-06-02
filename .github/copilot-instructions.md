# GitHub Copilot Instructions

## Security Requirements

### Secrets and Credentials

* Never read, access, inspect, parse, reference, or use any values from secret files.
* Ignore all environment variables and secrets.
* Never reveal, print, log, expose, or include API keys, tokens, passwords, credentials, certificates, private keys, connection strings, or sensitive values in generated code or responses.
* If code requires a secret, use placeholder values and explain where the secret should be configured.

### Restricted Files

Never access, analyze, summarize, or use content from:

* `.env`
* `.env.*`
* `.env.local`
* `.env.development`
* `.env.production`
* `*.key`
* `*.pem`
* `*.p12`
* `*.crt`
* `*.cer`
* `secrets/*`
* `credentials/*`
* `private/*`

### Environment Variables

* Use environment variables only by name.
* Never display or reveal environment variable values.
* When generating examples, use placeholders such as:

```ts
process.env.OPENAI_API_KEY
process.env.DATABASE_URL
process.env.JWT_SECRET
```

* Never hardcode secret values.

### Logging Rules

* Never generate code that logs secrets.
* Never output environment variables to the console.
* Never include secret values in error messages, comments, documentation, examples, or tests.

### Code Generation Standards

* Use secure coding practices.
* Prefer configuration through environment variable names.
* Use placeholder values such as:

```text
YOUR_API_KEY
YOUR_SECRET
YOUR_DATABASE_URL
```

instead of real credentials.

### Repository Safety

Assume all secret-related files are confidential and out of scope for code generation, analysis, explanations, summaries, refactoring, debugging, or documentation.

If a task requires information from a restricted file, ask the user to provide a non-sensitive placeholder or example value instead.
