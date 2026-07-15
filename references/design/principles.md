# Design Principles

## Core Principles

### Visual Hierarchy
- Most important element gets the most visual weight
- Use size, color, contrast, and spacing to guide attention
- One primary action per screen/section

### Consistency
- Use a design system (tokens, components, patterns)
- Same action = same appearance everywhere
- Document deviations explicitly

### Feedback
- Every user action gets visual feedback
- Loading states for async operations
- Error states are specific and actionable

## Color

### Palette
- Primary: brand color (used sparingly for CTAs)
- Neutral: grays for text, borders, backgrounds
- Semantic: success (green), warning (amber), error (red), info (blue)
- Dark mode: reduce contrast slightly, use elevated surfaces

### Accessibility
- WCAG 2.1 AA minimum (4.5:1 contrast for text)
- Don't rely on color alone to convey information
- Use patterns or labels alongside color

## Typography

### Scale
- Use a modular scale (e.g., 1.25 ratio)
- Base: 16px, then 20px, 25px, 31px, 39px
- Line height: 1.5 for body, 1.2 for headings

### Readability
- Max line length: 60-80 characters
- Adequate paragraph spacing
- Left-aligned for body text (avoid justified)

## Spacing

### System
- Use a base unit (4px or 8px)
- Multiply for consistency: 4, 8, 12, 16, 24, 32, 48, 64
- Consistent padding and margins

### White Space
- More space = more importance
- Don't fear empty space — it's a design element
- Group related items with proximity

## Components

### Buttons
- Primary: one per section (the main action)
- Secondary: for alternative actions
- Tertiary: for less important actions (text links)
- Clear labels: "Save" not "Submit" (be specific)

### Forms
- Labels always visible (not just placeholders)
- Inline validation (on blur, not on submit)
- Clear error messages with fix suggestions
- Group related fields

### Cards
- Consistent padding
- Clear visual boundaries
- Consistent action placement

## Sources

- Apple Human Interface Guidelines
- Google Material Design 3
- storybookjs/storybook (component documentation patterns)
- Shopify Polaris (design system)
- Atlassian Design System
