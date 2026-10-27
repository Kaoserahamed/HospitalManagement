# Accessibility Guidelines

## 1. Standard

Target WCAG 2.1 Level AA for all user-facing interfaces.

## 2. Principles

- Perceivable: text alternatives, captions, adaptable content, distinguishable.
- Operable: keyboard accessible, enough time, no seizures, navigable.
- Understandable: readable, predictable, input assistance.
- Robust: compatible with assistive technologies.

## 3. Implementation

- Semantic HTML elements.
- ARIA attributes where needed (not as replacement for semantics).
- Focus management and visible focus indicators.
- Color contrast ratio >= 4.5:1 for text.
- Form labels and error messages associated.
- Skip links for main content.

## 4. Testing

- Automated: axe-core in CI.
- Manual: keyboard-only navigation, screen reader (NVDA/VoiceOver).
- User testing with clinicians and patients (Phase 3).

## 5. Component Checklist

- [ ] Keyboard operable.
- [ ] Focus visible.
- [ ] Screen reader announced.
- [ ] Contrast sufficient.
- [ ] Error states accessible.
- [ ] Responsive.

## 6. References

- https://www.w3.org/WAI/WCAG21/quickref/
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 2, 4
