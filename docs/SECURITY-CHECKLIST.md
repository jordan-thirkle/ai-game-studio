# Security Checklist — Browser Games

> Security requirements for AI Game Studio games. Must check before deployment.

---

## Input Validation

### XSS Prevention
- [ ] Sanitize all user input before rendering
- [ ] Use `textContent` instead of `innerHTML`
- [ ] Escape special characters in dynamic content
- [ ] Validate URLs before loading (no `javascript:` protocol)

### Canvas Security
- [ ] No `toDataURL()` without user consent
- [ ] No cross-origin textures without CORS
- [ ] Sanitize GLTF/model filenames

---

## API Security

### Endpoint Protection
- [ ] Rate limiting on all endpoints
- [ ] CORS configured correctly (no `*` in production)
- [ ] API keys not exposed in client code
- [ ] Environment variables for sensitive config

### Data Validation
- [ ] Validate all server-side inputs
- [ ] Use parameterized queries (no SQL injection)
- [ ] Validate file uploads (type, size, content)
- [ ] Sanitize user-generated content

---

## Authentication & Authorization

### If Using Auth
- [ ] Use established library (NextAuth, Lucia, etc.)
- [ ] Never store passwords in plain text
- [ ] Use bcrypt/argon2 for hashing
- [ ] Implement CSRF protection
- [ ] Use secure session cookies (HttpOnly, Secure, SameSite)

### If Using Anonymous Auth
- [ ] Use `crypto.randomUUID()` for user IDs
- [ ] Store IDs in localStorage (not cookies)
- [ ] No PII collection without consent

---

## Data Privacy

### GDPR/CCPA Compliance
- [ ] Cookie consent banner (if using cookies)
- [ ] Privacy policy page
- [ ] Data deletion endpoint
- [ ] No tracking without consent
- [ ] Anonymize analytics data

### Data Storage
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for all data transfer
- [ ] Minimize data collection
- [ ] Regular data cleanup

---

## Payment Security

### If Using Payments
- [ ] Use established payment processor (Stripe, Xsolla)
- [ ] Never handle card numbers directly
- [ ] Implement webhook verification
- [ ] Validate payment server-side

### If Using Ads
- [ ] Use official SDKs (CrazyGames, Poki)
- [ ] No custom ad rendering
- [ ] Validate ad callbacks server-side
- [ ] Prevent ad fraud

---

## Game-Specific Security

### Anti-Cheat
- [ ] Server-side score validation (if multiplayer)
- [ ] Validate game state server-side
- [ ] Rate limit actions (prevent automation)
- [ ] Obfuscate client-side logic (if needed)

### Save Data
- [ ] Validate save data before loading
- [ ] Prevent save file manipulation
- [ ] Backup save data
- [ ] Handle corrupted saves gracefully

---

## Deployment Security

### Environment
- [ ] No debug mode in production
- [ ] No console.log with sensitive data
- [ ] Source maps disabled in production
- [ ] Error tracking with sanitized errors

### Dependencies
- [ ] Run `npm audit` before deploy
- [ ] Update vulnerable packages
- [ ] Lock dependency versions
- [ ] Use `npm ci` for builds

### Hosting
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CSP (Content Security Policy) set
- [ ] HSTS enabled

---

## Monitoring

### Error Tracking
- [ ] Sentry or similar configured
- [ ] No sensitive data in error reports
- [ ] Alert on security events

### Logging
- [ ] Log authentication attempts
- [ ] Log API errors
- [ ] Log payment events
- [ ] No PII in logs

---

## Pre-Deploy Checklist

Before every deployment:
- [ ] `npm audit` passes
- [ ] No hardcoded secrets
- [ ] Environment variables set
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CSP set
- [ ] Error tracking configured
- [ ] Privacy policy updated
- [ ] Cookie consent working (if applicable)

---

## Incident Response

If security issue found:
1. **Assess** — Is data at risk?
2. **Contain** — Stop the bleeding
3. **Notify** — Inform affected users (if required)
4. **Fix** — Patch the vulnerability
5. **Review** — Update checklist to prevent recurrence

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
