# Web Development Standards

## Type Safety

### TypeScript
- Use strict mode: `"strict": true` in tsconfig
- Avoid `any` — use `unknown` and narrow with type guards
- Use discriminated unions for state machines
- Export types alongside implementations

### Props & Components
- Use `type` not `interface` for component props (consistency)
- Destructure props in function signature
- Use `React.FC` sparingly — prefer explicit return types

## Documentation

### Code Comments
- Explain *why*, not *what*
- Comment complex algorithms and business logic
- Don't comment obvious code: `// increment counter` is noise

### README Structure
- One-line description
- Quick start (copy-pasteable)
- Architecture overview
- Contributing guidelines
- Source: `tailwindlabs/tailwindcss`

### AGENTS.md
- Codify pipeline rules
- Evidence-first, no self-certification
- Skill lifecycle, dependency gates
- Source: AI Game Studio (validated pattern)

## Performance

### Bundle Budget
- Track bundle size in CI
- Flag when JS exceeds threshold (500KB is a reasonable default)
- Use dynamic imports for non-critical code

### Lighthouse Targets
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

### Core Web Vitals
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## Testing

### Unit Tests
- Test behavior, not implementation
- One assertion per test when possible
- Use descriptive test names: "returns empty array when no items" not "test1"

### E2E Tests
- Test critical paths only
- Use page objects for complex flows
- Capture screenshots for visual regression

## Responsive Design

### Breakpoints
- Mobile-first approach
- Standard breakpoints: 640px, 768px, 1024px, 1280px
- Use container queries where supported

### Touch Targets
- Minimum 44x44px for interactive elements
- Adequate spacing between targets

## Sources

- microsoft/TypeScript
- tailwindlabs/tailwindcss (documentation patterns)
- vercel/next.js (modern web app patterns)
- Apple Human Interface Guidelines
- Google Material Design 3
