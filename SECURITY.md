# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within AI Game Studio, please send an email to **jordan@byjtt.com**. All security vulnerabilities will be promptly addressed.

**Please do NOT report security vulnerabilities through public GitHub issues.**

## What to Include

- Type of vulnerability (e.g., XSS, SQL injection, etc.)
- Full paths of source file(s) related to the vulnerability
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 1 week
- **Fix or mitigation:** Within 2 weeks for critical, 30 days for others

## Scope

This applies to:
- The AI Game Studio web application ([ai-game-studio-one.vercel.app](https://ai-game-studio-one.vercel.app))
- The GitHub repository and all associated code
- Game embeds served through this platform

## Out of Scope

- Third-party services (Vercel, GitHub, etc.) — report to them directly
- Game-specific vulnerabilities in individual game repos (report in those repos)
- Social engineering attacks

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest main |  |
| Previous releases |  |

## Security Best Practices for Contributors

- Never commit API keys, tokens, or secrets
- Use environment variables for all sensitive configuration
- Run `npm audit` before submitting PRs
- Follow OWASP guidelines for web application security
