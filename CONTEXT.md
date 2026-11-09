# Front-End Architecture & Business Context — Med/Dental E-Commerce

## 1. Executive Summary & Vision
- **Repository Name:** `med-dental-storefront`
- **Core Purpose:** High-performance, responsive React e-commerce web application selling specialized medical and dental equipment, consumables, and pharmaceuticals.
- **Product Vision:** Built using a mobile-first, responsive design architecture designed to easily share UI components, business hooks, and data models with a future React Native / Expo mobile app.
- **Primary Users:** Licensed Dentists, Medical Practitioners, Clinic Managers, and Procurement Teams.


# Front-End Architecture & Business Context — Med/Dental E-Commerce

## 1. Executive Summary & Vision
- Repository Name: med-dental-storefront
- Core Purpose: High-performance, responsive React e-commerce web application selling specialized medical and dental equipment, consumables, and pharmaceuticals.
- Product Vision: Built using a mobile-first, responsive design architecture designed to easily share UI components, business hooks, and data models with a future React Native / Expo mobile app.
- Primary Users: Licensed Dentists, Medical Practitioners, Clinic Managers, and Procurement Teams.

---

## 2. High-Level Architecture

System Data Flow:
1. React Web Storefront (Responsive / Mobile-First)
   |--> Saleor GraphQL Engine (Products, Cart, Checkout)
   |--> Flask Auth & User REST API (Role Auth, License Verification)
2. Backend Services -> PostgreSQL Database (Containerized/Docker)

---

## 3. Business Glossary & Domain Language
Rule: Use these exact business terms across code identifiers (React props, state names, API variables). Avoid using synonyms to ensure domain clarity across medical/dental procurement.

- Practitioner License (`practitionerLicense`): Verified medical/dental license required to purchase restricted products. Avoid: Doctor ID, Cert, Permit.
- Product Variant (`variant`): Specific size, pack count, or spec (e.g., Composite Shade A2, 100/Box). Avoid: SKU Child, Option, Sub-item.
- B2B Bulk Price (`tieredPricing`): Discounted volume pricing applied based on order volume. Avoid: Bulk Deal, Wholesaler Price.
- Prescription / Restricted Item (`restrictedProduct`): Medical item requiring verified credentials before purchase approval. Avoid: RX Product, Hazard Item.
- Cart (`cart` / `checkout`): Temporary state for selected items backed by Saleor Checkout ID. Avoid: Basket, Bag.

---

## 4. Dual-Backend Integration Rules

1. Saleor GraphQL API (E-Commerce Operations)
- Scope: Product Catalog, Categories, Collections, Cart/Checkout creation, Order History, and Payment processing.
- Standard: All GraphQL queries and mutations must live under src/graphql/ and use typed codegen hooks.
- Ordering/Sorting: Always support explicit orderBy variables when querying product lists or category children.

2. Flask REST API (Authentication & Licensing)
- Scope: User login/signup JWT issuance, Medical/Dental license verification uploads, B2B user role management, and clinic profile settings.
- Standard: Axios or Fetch instances handling Flask endpoints must attach the Bearer JWT token from local storage/secure state.

---

## 5. Architectural Invariants & Safety Guardrails

1. Mobile-First Responsive Components:
   All UI layouts must be built using mobile-first breakpoints (Tailwind / CSS-in-JS).
   Logic (data fetching, cart calculations, authentication hooks) must be kept strictly separate from visual components in custom hooks (src/hooks/) so they can be reused when launching the mobile app.

2. Restricted Medical Product Safety:
   Checkout button must be disabled/guarded if the cart contains restrictedProduct items and the user's practitionerLicense status is not VERIFIED.

3. Currency & Price Handling:
   Never round or format currency raw in JSX. Always use the central price utility formatPrice(amount, currencyCode) to handle localized currency display correctly.

4. Environment File Security:
   NEVER modify .env, .env.development, or .env.production without consulting the lead implementer. Local development variables should be copied from .env.example.

---

## 6. Local Development & Docker Commands

Quick Setup with Docker:
- Start complete environment: docker-compose up -d
- View React Frontend logs: docker-compose logs -f frontend
- Regenerate TypeScript types: npm run generate:graphql

Useful Workflows:
- Run Linter: npm run lint
- Build Web Bundle: npm run build
- Test Responsive Layouts: npm run test:e2e

---

## 7. High-Level Architecture

                              ┌──────────────────────────────┐
                              │   React Web Storefront       │
                              │ (Responsive / Mobile-First)  │
                              └──────────────┬───────────────┘
                                             │
                    ┌────────────────────────┴────────────────────────┐
                    ▼                                                 ▼
    ┌──────────────────────────────┐                ┌──────────────────────────────┐
    │    Saleor GraphQL Engine     │                │   Flask Auth & User REST API │
    │  (Products, Cart, Checkout)  │                │  (Role Auth, License       Verification) │
    └──────────────┬───────────────┘                └──────────────┬───────────────┘
                   │                                               │
                   └──────────────────────┬────────────────────────┘
                                          ▼
                             ┌──────────────────────────┐
                             │ PostgreSQL Database      │
                             │ (Containerized/Docker)   │
                             └──────────────────────────┘
<!-- 
## 3. Business Glossary & Domain Language
> **Rule:** Use these exact business terms across code identifiers (React props, state names, API variables). Avoid using synonyms to ensure domain clarity across medical/dental procurement.

| Term | Approved Code Identifier | Definition | Unapproved Synonyms (DO NOT USE) |
| :--- | :--- | :--- | :--- |
| **Practitioner License** | `practitionerLicense` | Verified medical/dental license required to purchase restricted products. | *Doctor ID, Cert, Permit* |
| **Product Variant** | `variant` | Specific size, pack count, or spec (e.g., Composite Shade A2, 100/Box). | *SKU Child, Option, Sub-item* |
| **B2B Bulk Price** | `tieredPricing` | Discounted volume pricing applied based on order volume. | *Bulk Deal, Wholesaler Price* |
| **Prescription / Restricted Item** | `restrictedProduct` | Medical item requiring verified credentials before purchase approval. | *RX Product, Hazard Item* |
| **Cart** | `cart` / `checkout` | Temporary state for selected items backed by Saleor Checkout ID. | *Basket, Bag* |

---

## 4. Dual-Backend Integration Rules

### 1. Saleor GraphQL API (E-Commerce Operations)
* **Scope:** Product Catalog, Categories, Collections, Cart/Checkout creation, Order History, and Payment processing.
* **Standard:** All GraphQL queries and mutations must live under `src/graphql/` and use typed codegen hooks.
* **Ordering/Sorting:** Always support explicit `orderBy` variables when querying product lists or category children.

### 2. Flask REST API (Authentication & Licensing)
* **Scope:** User login/signup JWT issuance, Medical/Dental license verification uploads, B2B user role management, and clinic profile settings.
* **Standard:** Axios or Fetch instances handling Flask endpoints must attach the Bearer JWT token from local storage/secure state.

---

## 5. Architectural Invariants & Safety Guardrails

1. **Mobile-First Responsive Components:**
   * All UI layouts must be built using mobile-first breakpoints (Tailwind / CSS-in-JS).
   * Logic (data fetching, cart calculations, authentication hooks) **must be kept strictly separate from visual components** in custom hooks (`src/hooks/`) so they can be reused when launching the mobile app.

2. **Restricted Medical Product Safety:**
   * Checkout button must be disabled/guarded if the cart contains `restrictedProduct` items and the user's `practitionerLicense` status is not `VERIFIED`.

3. **Currency & Price Handling:**
   * Never round or format currency raw in JSX. Always use the central price utility `formatPrice(amount, currencyCode)` to handle localized currency display correctly.

4. **Environment File Security:**
   * NEVER modify `.env`, `.env.development`, or `.env.production` without consulting the lead implementer. Local development variables should be copied from `.env.example`.

---

## 6. Local Development & Docker Commands

### Quick Setup with Docker
```bash
# 1. Start the complete environment (React + Flask + Saleor + Postgres)
docker-compose up -d

# 2. View React Frontend logs
docker-compose logs -f frontend

# 3. Regenerate TypeScript types from Saleor GraphQL schema
npm run generate:graphql -->