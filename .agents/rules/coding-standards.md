---
trigger: always_on
---

---
trigger: Always On
---

# React Frontend — Coding Standards & Implementation Rules

## 0. Always debug and correct the issue if its not fresh feature.
always add console log's and ask user to paste it for reference then analyse and code.

## 1. Architectural Integrity & Planning First

### Mandatory Implementation Planning
- **Plan Before Code:** Before writing or modifying any code (beyond tiny text updates or minor color changes), create a clear step-by-step implementation plan.
- **Plan Validation:** Verify that the plan aligns with the existing architecture and does not break existing features, component contracts, or state management flows.
- **Architectural Approval:** Use existing patterns and established libraries in the codebase. If a requirement forces an architectural shift (e.g., introducing a new state library, changing routing strategies, or altering core layout structures), **STOP and ask the human implementer/maintainer for approval** before proceeding.

### Minimal Code Footprint
- Do not refactor untouched files, update unrequested dependencies, or modify code formatting across unrelated files.
- Small text changes and single CSS/color variable updates do not require full architectural approval, but must still pass linting and code review checks.

---

## 2. Environment & Configuration Protection

- **DO NOT modify `.env`, `.env.development`, `.env.production`, or `.env.local` files without explicit consultation and confirmation.**
- If new environment variables are needed:
  1. Add placeholder definitions to `.env.example`.
  2. Ask the user/implementer to update local `.env.*` files manually.

---

## 3. React & TypeScript Coding Standards

### Component Structure & Architecture
- **Functional Components Only:** Use TypeScript functional components (`React.FC` or typed props functions).
- **Single Responsibility:** Break large UI structures into small, modular components inside `src/components/`.
- **Props Typing:** Declare explicit TypeScript interfaces or types for all component props. Avoid using `any`.
```typescript
// GOOD
interface CategoryBannerProps {
  slug: string;
  onSelectCategory?: (id: string) => void;
}

export const CategoryBanner: React.FC<CategoryBannerProps> = ({ slug, onSelectCategory }) => { ... };


## 4. Testing Standards

- **Hook Unit Tests:** Every custom hook in `src/hooks/` must have an accompanying `.test.ts` file covering edge cases.
- **Critical Path E2E:** Any changes to the Checkout, License Upload, or Cart flows must include or update a Playwright E2E test.
- **Mocking Strategy:** Mock Saleor GraphQL responses using MSW (Mock Service Worker) or local fixtures—do not hit live external APIs in unit tests.