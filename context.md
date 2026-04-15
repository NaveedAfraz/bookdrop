# Bookdrop — Full Project Context Document

> **Version**: Production-ready (April 2026)  
> **Tagline**: *Swipe. Read. Trade. Every book has a journey.*  
> **Live URL**: https://bookdrop-delta.vercel.app  
> **Repository**: NaveedAfraz/bookdrop

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Architecture & Directory Structure](#3-project-architecture--directory-structure)
4. [Database Design](#4-database-design)
5. [Backend — Server & Configuration](#5-backend--server--configuration)
6. [Backend — Middleware](#6-backend--middleware)
7. [Backend — API Routes (All 18 Modules)](#7-backend--api-routes-all-18-modules)
8. [Frontend — Configuration & Entry Point](#8-frontend--configuration--entry-point)
9. [Frontend — Design System & Theming](#9-frontend--design-system--theming)
10. [Frontend — State Management (AuthContext)](#10-frontend--state-management-authcontext)
11. [Frontend — API Layer](#11-frontend--api-layer)
12. [Frontend — Shared Components](#12-frontend--shared-components)
13. [Frontend — All Pages (23 Pages)](#13-frontend--all-pages-23-pages)
14. [Frontend — Routing Architecture](#14-frontend--routing-architecture)
15. [Feature Module Deep Dives](#15-feature-module-deep-dives)
16. [Database Migration Strategy](#16-database-migration-strategy)
17. [Data Seeding & Demo Accounts](#17-data-seeding--demo-accounts)
18. [Security Implementation](#18-security-implementation)
19. [Deployment Architecture](#19-deployment-architecture)
20. [UI/UX Design Philosophy](#20-uiux-design-philosophy)
21. [Complete API Reference](#21-complete-api-reference)
22. [Entity-Relationship Summary](#22-entity-relationship-summary)
23. [Key Business Logic & Algorithms](#23-key-business-logic--algorithms)
24. [Known Limitations & Future Scope](#24-known-limitations--future-scope)

---

## 1. Project Overview

### 1.1 What is Bookdrop?

Bookdrop is a full-stack e-commerce platform for books that goes beyond simple buying and selling. It combines:
- A **first-hand bookstore** (admin-managed inventory)
- A **peer-to-peer second-hand marketplace** (user-listed pre-loved books)
- A **book provenance tracking system** ("Book Journey") that traces every copy's history through different owners and cities
- A **Tinder-style swipe discovery engine** for book recommendations
- **Reading Challenges** and gamification with reward points
- **Curated Bundles** with automatic discount calculations
- A **Read Together** rooms system (collaborative reading with chat)
- **Geographic and Temporal discovery** via an interactive World Map and Time Machine
- **Quiz-based book recommendations**
- A **Course Viewer** for purchased book bundles (video content)
- A full **Admin Dashboard** with analytics, CRUD management, refund handling

### 1.2 Core User Personas

| Persona | Description | Key Features |
|---------|-------------|-------------|
| **Reader (User)** | Registers, browses, buys, reviews, sells | Shop, Cart, Checkout, Orders, Wishlist, Swipe Discovery, Challenges |
| **Trader (User)** | Lists pre-loved books, traces journeys | Marketplace, Sell Book, Journey Timeline, Book Notes |
| **Admin** | Manages platform data, handles refunds | Admin Dashboard with all CRUD, analytics, refund approval |

### 1.3 Key Differentiators

1. **Book Journey / Provenance Tracking**: Every second-hand book copy has a tracked chain-of-ownership with city locations, timestamps, and personal reader notes — similar to blockchain-inspired traceability.
2. **Swipe-Based Book Discovery**: Tinder-like card interface where right-swipe adds to wishlist, left-swipe skips, providing a modern engagement-driven discovery experience.
3. **Geographical & Temporal Discovery**: Users can explore books by clicking countries on an interactive world map or by selecting historical eras in a "Time Machine" interface.
4. **Gamified Reading Challenges**: Users join challenges (e.g., "Read 5 books from 5 countries in 60 days"), earn reward points, and track progress. Purchase of books automatically increments challenge progress.
5. **Read Together Rooms**: Collaborative reading rooms with invite codes and messaging, requiring book ownership to join.

---

## 2. Technology Stack

### 2.1 Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | — | Runtime environment |
| **Express.js** | v5.2.1 | HTTP framework |
| **MySQL** | — | Relational database |
| **mysql2/promise** | v3.22.0 | MySQL driver with connection pooling |
| **bcryptjs** | v3.0.3 | Password hashing (salt rounds: 10) |
| **jsonwebtoken** | v9.0.3 | JWT authentication tokens |
| **cors** | v2.8.6 | Cross-Origin Resource Sharing |
| **dotenv** | v17.4.2 | Environment variable management |
| **nodemon** | v3.1.9 | Development hot-reload (devDependency) |

### 2.2 Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | v19.2.4 | UI library |
| **TypeScript** | ~6.0.2 | Type safety |
| **Vite** | v8.0.4 | Build tool & dev server |
| **Tailwind CSS** | v4.2.2 | Utility-first styling |
| **React Router DOM** | v7.14.1 | Client-side routing |
| **Axios** | v1.15.0 | HTTP client |
| **Framer Motion** | v12.38.0 | Animations (available but minimally used) |
| **Lucide React** | v1.8.0 | Icon library |
| **React Hot Toast** | v2.6.0 | Toast notifications |
| **Recharts** | v3.8.1 | Charts for admin analytics |
| **React Simple Maps** | v3.0.0 | Interactive SVG world map |
| **React Player** | v3.4.0 | YouTube video embedding for courses |
| **d3-geo** | v3.1.1 | Geographic projections (dependency of react-simple-maps) |
| **topojson-client** | v3.1.0 | TopoJSON parsing for maps |
| **React Loading Skeleton** | v3.5.0 | Loading placeholders |
| **@vercel/analytics** | v2.0.1 | Production analytics |

### 2.3 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | TypeScript linting |
| **@vitejs/plugin-react** | React Fast Refresh |
| **@rolldown/plugin-babel** | Babel integration |
| **babel-plugin-react-compiler** | React Compiler (experimental) |

---

## 3. Project Architecture & Directory Structure

### 3.1 Monorepo Structure

```
Bookdrop/
├── .gitignore
├── backend/                    # Express API Server
│   ├── .env                    # Environment variables (DB credentials, JWT secret)
│   ├── .env.example            # Template for env vars
│   ├── server.js               # Express app entry point & route registration
│   ├── db.js                   # MySQL connection pool (mysql2/promise)
│   ├── package.json            # Backend dependencies
│   ├── schema.sql              # Initial database schema (DDL)
│   ├── seed.js                 # Production-quality seed data (30 books, 6 users, orders, etc.)
│   ├── seed-phase4.js          # Supplementary seed for Phase 4 features
│   ├── seed-phase5.js          # Supplementary seed for Phase 5 features
│   ├── init-db.js              # Database initialization helper
│   ├── migrate-inr.js          # Migration: USD→INR price conversion, cover image fixes
│   ├── migrate-phase3.js       # Migration: Second-hand marketplace & journey tables
│   ├── migrate-phase4.js       # Migration: Challenges, bundles, rooms tables
│   ├── migrate-phase5.js       # Migration: Reviews, refunds, courses, admin role
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT token verification → req.user
│   │   └── adminMiddleware.js  # Role-based access control (role === 'admin')
│   └── routes/                 # All 18 API route modules
│       ├── auth.js             # Register, Login, Profile (/api/auth)
│       ├── addresses.js        # Address CRUD (/api/addresses)
│       ├── books.js            # Book CRUD with search/filter/sort (/api/books)
│       ├── chapters.js         # Chapter content (free/paid) (/api/chapters)
│       ├── cart.js             # Cart management (/api/cart)
│       ├── orders.js           # Order placement & retrieval (/api/orders)
│       ├── wishlist.js         # Wishlist + move-to-cart (/api/wishlist)
│       ├── swipes.js           # Swipe feed & action recording (/api/swipes)
│       ├── secondHand.js       # Second-hand book listings (/api/secondHand)
│       ├── journey.js          # Book journey/provenance timeline (/api/journey)
│       ├── challenges.js       # Reading challenges (/api/challenges)
│       ├── bundles.js          # Book bundles with discounts (/api/bundles)
│       ├── rooms.js            # Read-together rooms (/api/rooms)
│       ├── discovery.js        # Map & timeline filters (/api/discovery)
│       ├── reviews.js          # Book reviews (purchase-verified) (/api/reviews)
│       ├── refunds.js          # User refund requests (/api/refunds)
│       ├── courses.js          # Course content for purchased books (/api/courses)
│       └── admin.js            # Admin dashboard endpoints (/api/admin)
│
└── frontend/                   # React + Vite + TypeScript SPA
    ├── .env                    # VITE_API_URL
    ├── index.html              # HTML shell
    ├── vite.config.ts          # Vite + React + Babel + TailwindCSS plugins
    ├── vercel.json             # Vercel SPA routing config
    ├── package.json            # Frontend dependencies
    ├── tsconfig.json           # TypeScript config
    ├── public/                 # Static assets
    └── src/
        ├── main.tsx            # React DOM render + Vercel Analytics
        ├── App.tsx             # Root component with Router + Routes
        ├── App.css             # Legacy Vite boilerplate CSS (unused)
        ├── index.css           # Design system: theme, fonts, utilities, animations
        ├── lib/
        │   └── api.ts          # Axios instance with baseURL + JWT interceptor
        ├── context/
        │   └── AuthContext.tsx  # React Context for auth state (token, user, login, logout)
        ├── components/
        │   ├── Navbar.tsx       # Global navigation with mobile hamburger menu
        │   ├── CartDrawer.tsx   # Slide-out cart panel (overlay drawer)
        │   └── ProtectedRoute.tsx # Auth guard + admin-only gate
        └── pages/              # 23 page components
            ├── Home.tsx
            ├── BookListing.tsx
            ├── BookDetail.tsx
            ├── ChapterReader.tsx
            ├── Login.tsx
            ├── Register.tsx
            ├── Cart.tsx
            ├── Checkout.tsx
            ├── OrderSuccess.tsx
            ├── MyOrders.tsx
            ├── Wishlist.tsx
            ├── SwipePage.tsx
            ├── SellBook.tsx
            ├── Marketplace.tsx
            ├── JourneyTimeline.tsx
            ├── ChallengesPage.tsx
            ├── BundlesPage.tsx
            ├── QuizPage.tsx
            ├── RoomInterface.tsx
            ├── WorldMap.tsx
            ├── TimeMachine.tsx
            ├── CourseViewer.tsx
            └── AdminDashboard.tsx
```

### 3.2 Architectural Pattern

The application follows a classic **3-Tier Architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                     │
│   React SPA (Vite + TypeScript + TailwindCSS)           │
│   Deployed on Vercel (https://bookdrop-delta.vercel.app)│
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP (Axios, REST API)
                        │ JWT Bearer Token Auth
┌───────────────────────▼─────────────────────────────────┐
│                    APPLICATION TIER                       │
│   Express.js REST API (Node.js)                          │
│   18 Route Modules + 2 Middleware                        │
│   Deployed on Railway/Render/Manual VPS                  │
└───────────────────────┬─────────────────────────────────┘
                        │ mysql2/promise (Connection Pool)
┌───────────────────────▼─────────────────────────────────┐
│                      DATA TIER                           │
│   MySQL Relational Database                              │
│   22+ Tables with Foreign Keys                           │
│   Hosted on Aiven / PlanetScale / Local                  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Database Design

### 4.1 Complete Schema — All Tables

The database consists of **22 tables** organized into the following domains:

#### User Domain
| Table | Purpose |
|-------|---------|
| `users` | User accounts with name, email, hashed password, role (user/admin), points |
| `addresses` | Shipping addresses linked to users (full_name, phone, street, city, state, pincode, is_default) |

#### Catalog Domain
| Table | Purpose |
|-------|---------|
| `books` | Master book catalog (title, author, description, price, stock, cover_image, category, country, published_year) |
| `chapters` | Book chapter content, some marked as `is_free` for preview |

#### E-Commerce Domain
| Table | Purpose |
|-------|---------|
| `cart` | One cart per user |
| `cart_items` | Items in a cart with price snapshot, quantity, is_second_hand flag, sh_book_id |
| `orders` | Placed orders with total_amount, payment_status, order_status |
| `order_items` | Line items per order with book_id, quantity, price, is_second_hand, sh_book_id |

#### Discovery & Engagement Domain
| Table | Purpose |
|-------|---------|
| `wishlist` | User–Book many-to-many (UNIQUE constraint on user_id,book_id) |
| `user_swipes` | Records swipe actions (RIGHT/LEFT/UP/DOWN) for the discovery feed |
| `reviews` | Book reviews with name, review_text, rating (1–5), created_at |

#### Second-Hand Marketplace Domain
| Table | Purpose |
|-------|---------|
| `second_hand_books` | Individual pre-loved copies for sale (book_id FK, seller_id, price, condition_desc [Good/Fair/Worn], status [AVAILABLE/SOLD]) |
| `book_journey` | Provenance chain — each row is one ownership leg (sh_book_id, owner_id, city, note, owned_from timestamp) |

#### Gamification Domain
| Table | Purpose |
|-------|---------|
| `challenges` | Challenge definitions (title, description, book_count, duration_days, reward_points, target_category) |
| `user_challenges` | Join table tracking user progress (books_read, joined_at, completed_at) |

#### Bundle Domain
| Table | Purpose |
|-------|---------|
| `bundles` | Named bundles with discount percentage |
| `bundle_books` | Join table associating bundles to books |

#### Social Reading Domain
| Table | Purpose |
|-------|---------|
| `read_together_rooms` | Reading rooms with invite_code, linked to a book |
| `room_members` | Users in a room, tracking current_chapter |
| `room_messages` | Chat messages within a room |

#### Returns & Refunds Domain
| Table | Purpose |
|-------|---------|
| `refund_requests` | Refund requests with reason, status (PENDING/APPROVED/REJECTED) |

#### Learning Domain
| Table | Purpose |
|-------|---------|
| `courses` | Video courses linked to books (title, video_url, description) |

### 4.2 Key Relationships Diagram (Textual)

```
users (1) ──→ (N) addresses
users (1) ──→ (1) cart ──→ (N) cart_items ──→ books
users (1) ──→ (N) orders ──→ (N) order_items ──→ books
users (1) ──→ (N) wishlist ──→ books
users (1) ──→ (N) user_swipes ──→ books
users (1) ──→ (N) second_hand_books ──→ books
users (1) ──→ (N) book_journey (as owner)
users (1) ──→ (N) user_challenges ──→ challenges
users (1) ──→ (N) refund_requests
users (1) ──→ (N) read_together_rooms (as creator)
users (1) ──→ (N) room_members
users (1) ──→ (N) room_messages

books (1) ──→ (N) chapters
books (1) ──→ (N) reviews
books (1) ──→ (N) courses
books (1) ──→ (N) bundle_books ──→ bundles

second_hand_books (1) ──→ (N) book_journey
```

### 4.3 Key Constraints

- `wishlist`: UNIQUE(user_id, book_id) — prevents double-wishlisting
- `user_swipes`: UNIQUE(user_id, book_id) — prevents re-swiping same book
- `read_together_rooms.invite_code`: UNIQUE — globally unique room codes
- `reviews.rating`: CHECK (rating >= 1 AND rating <= 5)
- All foreign keys use ON DELETE CASCADE except order-related FKs (to preserve order history)

---

## 5. Backend — Server & Configuration

### 5.1 Server Entry Point (`server.js`)

The Express application:
1. Loads environment variables via `dotenv`
2. Configures **CORS** to allow both production (`https://bookdrop-delta.vercel.app`) and local dev (`http://localhost:5173`)
3. Registers **18 route modules** on respective `/api/*` paths
4. Starts on `PORT` from env (default: 5001)

### 5.2 Database Connection (`db.js`)

Uses `mysql2/promise` with connection pooling:
- `connectionLimit: 10`
- `waitForConnections: true`
- `queueLimit: 0` (unlimited queue)

Connection parameters from `.env`:
```
DB_HOST=<host>
DB_PORT=<port>
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=BookDrop
JWT_SECRET=<secret>
PORT=5001
```

---

## 6. Backend — Middleware

### 6.1 Authentication Middleware (`authMiddleware.js`)

- Extracts `Authorization: Bearer <token>` header
- Verifies JWT using `process.env.JWT_SECRET`
- Decodes token into `req.user` object containing `{id, name, role}`
- Returns 401 if no token or invalid/expired token

### 6.2 Admin Middleware (`adminMiddleware.js`)

- Checks `req.user.role === 'admin'`
- Returns 403 if not admin
- Always used **after** `authMiddleware` (chained as `[authMiddleware, adminMiddleware]`)

---

## 7. Backend — API Routes (All 18 Modules)

### 7.1 Auth Routes (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | ❌ | Create new user (name, email, password). Hashes password with bcrypt (10 salt rounds). Checks for duplicate email. |
| POST | `/login` | ❌ | Authenticate user. Returns JWT token (1h expiry) + user object {id, name, email, role}. Token payload includes `{id, name, role}`. |
| GET | `/me` | ✅ | Get current user profile (id, name, email, role). |

### 7.2 Address Routes (`/api/addresses`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ | List all addresses for current user |
| POST | `/` | ✅ | Create new address. If `is_default`, unsets other defaults first. |
| PUT | `/:id` | ✅ | Update address (ownership verified via user_id) |
| DELETE | `/:id` | ✅ | Delete address (ownership verified) |

### 7.3 Book Routes (`/api/books`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ❌ | List all books. Supports query params: `search` (title/author LIKE), `category` (exact match), `sortBy` (price_asc, price_desc, or created_at DESC default). |
| GET | `/:id` | ❌ | Get single book by ID |
| POST | `/` | ✅🔒 | Create book (admin only). Fields: title, author, description, price, stock, cover_image, category, country, published_year. |
| PUT | `/:id` | ✅🔒 | Update book (admin only) |
| DELETE | `/:id` | ✅🔒 | Delete book (admin only) |

### 7.4 Chapter Routes (`/api/chapters`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/:bookId` | ❌ | Get chapters for a book. Content is NULL for non-free chapters (only `is_free=1` chapters return content). |

### 7.5 Cart Routes (`/api/cart`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ | Get current user's cart with items, total. Auto-creates cart if none exists. Join to `books` table for full item details. |
| POST | `/add` | ✅ | Add item to cart. Accepts `{book_id, quantity, is_second_hand, sh_book_id}`. If second-hand, verifies availability. Checks for existing item — if first-hand, increments quantity; if second-hand duplicate, rejects. Price snapshot captured at add time. |
| PUT | `/update/:itemId` | ✅ | Update item quantity. Prevents second-hand items from having quantity > 1. Deletes item if quantity ≤ 0. |
| DELETE | `/remove/:itemId` | ✅ | Remove specific item from cart |

**Key Business Logic**: Price is snapshotted into `cart_items.price` at the time of adding. Second-hand books are unique physical copies and cannot have quantity > 1.

### 7.6 Order Routes (`/api/orders`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/place` | ✅ | **Core transaction** — Places order from cart. Uses MySQL transactions. See detailed flow below. |
| GET | `/` | ✅ | Get all orders for current user with items (JOIN order_items + books) |
| GET | `/user` | ✅ | Alias of above for frontend compatibility |

**Order Placement Flow** (`POST /place`):
1. Begin transaction
2. Get user's cart and cart_items
3. For each item:
   - If **second-hand**: Check `status = 'AVAILABLE'` with `FOR UPDATE` lock
   - If **first-hand**: Check `stock >= quantity` with `FOR UPDATE` lock
4. Calculate total amount
5. Apply **bundle discount**: 3+ items = 5%, 5+ items = 10%, 10+ items = 15%
6. INSERT into `orders` table
7. For each item:
   - INSERT into `order_items`
   - If **second-hand**: UPDATE status to `SOLD`, CREATE `book_journey` entry with buyer's city
   - If **first-hand**: Decrement `books.stock`, INCREMENT `user_challenges.books_read` for matching active challenges
8. Clear cart items
9. Commit transaction
10. Return `{orderId, secondHandBookIds, discountApplied}`

### 7.7 Wishlist Routes (`/api/wishlist`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ | Get user's wishlist with full book details |
| DELETE | `/:bookId` | ✅ | Remove book from wishlist |
| POST | `/cart` | ✅ | **Transactional move-to-cart**: Removes from wishlist, adds to cart with price lookup. Uses explicit transaction. |

### 7.8 Swipe Routes (`/api/swipes`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | ✅ | Record a swipe action (RIGHT/LEFT/UP/DOWN). RIGHT swipe also auto-adds to wishlist via `INSERT IGNORE`. |
| GET | `/feed` | ✅ | Get books user hasn't swiped yet (LEFT JOIN exclusion, RAND() order, LIMIT 10). |

### 7.9 Second-Hand Routes (`/api/secondHand`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ❌ | List all available second-hand books with seller info and city. JOINs second_hand_books + books + users + addresses(subquery for city). |
| POST | `/sell` | ✅ | List a book for sale. Creates `second_hand_books` record with {book_id, seller_id, price, condition_desc}. |
| GET | `/book/:bookId` | ❌ | Get available second-hand copies for a specific book (used on BookDetail page). |

### 7.10 Journey Routes (`/api/journey`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/:shBookId` | ❌ | Get provenance timeline for a specific second-hand book copy. Returns chronological ownership chain with owner names, cities, notes. |
| GET | `/leaderboard/most-travelled` | ❌ | Top 10 most-traded book copies (GROUP BY sh_book_id, COUNT journeys, ORDER by count DESC). |
| POST | `/note` | ✅ | Add a personal note to your ownership leg. Verifies the user is the most recent owner of that copy. |

### 7.11 Challenge Routes (`/api/challenges`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ | List all challenges with user's progress (LEFT JOIN user_challenges). Returns `books_read`, `completed_at`, `is_joined`. |
| POST | `/join` | ✅ | Join a challenge (INSERT IGNORE prevents duplicates). |
| POST | `/complete` | ✅ | Complete a challenge — awards `reward_points` to user, sets `completed_at`. Uses transaction. |

### 7.12 Bundle Routes (`/api/bundles`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ❌ | List all bundles with full book details. Calculates `original_price` (sum of book prices) and `discounted_price` server-side. |
| POST | `/custom-discount` | ✅ | Calculate dynamic discount based on cart size (3+ = 5%, 5+ = 10%, 10+ = 15%). |

### 7.13 Room Routes (`/api/rooms`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/join` | ✅ | Join or create a reading room. **Requires book ownership** (checks order_items). Generates random invite_code if not provided. |
| GET | `/:roomId/messages` | ✅ | Get chat messages for a room (chronological, includes user names). |

### 7.14 Discovery Routes (`/api/discovery`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/map/:country` | ❌ | Filter books by country name (for World Map feature) |
| GET | `/timeline/:start/:end` | ❌ | Filter books by published_year range (for Time Machine feature) |
| GET | `/countries` | ❌ | Get all unique countries that have books in the catalog |

### 7.15 Review Routes (`/api/reviews`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | ✅ | Post a review. **Requires book purchase** (verifies via order_items JOIN orders). Fields: book_id, review_text, rating, name (defaults to "Anonymous"). |
| GET | `/:bookId` | ❌ | Get all reviews for a book (newest first) |

### 7.16 Refund Routes (`/api/refunds`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/request` | ✅ | Submit refund request. Verifies purchase exists in order_items. Prevents duplicate requests for same book+order combo. |
| GET | `/my-requests` | ✅ | Get user's own refund requests with book titles |

### 7.17 Course Routes (`/api/courses`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/:bookId` | ✅ | Get courses for a purchased book. **Requires ownership** (verifies via order_items). Returns course list with video URLs. |

### 7.18 Admin Routes (`/api/admin`)

All admin routes require `[authMiddleware, adminMiddleware]` chain.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/stats` | Dashboard stats: revenue, userCount, orderCount, bookCount, challengeCount, recentSales (7-day), categorySales breakdown |
| GET | `/refunds` | All refund requests with user/book names |
| PUT | `/refunds/:id` | Update refund status (APPROVED/REJECTED) |
| GET | `/users` | List all users |
| PUT | `/users/:id` | Update user (name, email, role) |
| DELETE | `/users/:id` | Delete user |
| GET | `/orders` | List all orders with customer info |
| PUT | `/orders/:id` | Update order status/payment status |
| DELETE | `/orders/:id` | Delete order |
| GET | `/challenges` | List all challenges |
| POST | `/challenges` | Create challenge |
| PUT | `/challenges/:id` | Update challenge |
| DELETE | `/challenges/:id` | Delete challenge |
| GET | `/bundles` | List all bundles |
| POST | `/bundles` | Create bundle |
| PUT | `/bundles/:id` | Update bundle |
| DELETE | `/bundles/:id` | Delete bundle |
| GET | `/marketplace` | List all second-hand listings with seller/book info |
| POST | `/marketplace` | Create second-hand listing (admin creates listing, also creates book entry if title+author doesn't exist) |
| PUT | `/marketplace/:id` | Update listing (price, condition, status) |
| DELETE | `/marketplace/:id` | Delete listing |
| GET | `/rooms` | List all reading rooms with member counts |
| DELETE | `/rooms/:id` | Delete room |

---

## 8. Frontend — Configuration & Entry Point

### 8.1 Vite Configuration (`vite.config.ts`)

```typescript
plugins: [
  react(),                               // React Fast Refresh
  babel({ presets: [reactCompilerPreset()] }), // React Compiler (experimental)
  tailwindcss(),                          // Tailwind CSS v4
]
```

### 8.2 Entry Point (`main.tsx`)

- Renders `<App />` inside `<React.StrictMode>`
- Initializes **Vercel Analytics** via `inject()`
- Imports `index.css` for the global design system

### 8.3 Environment Variables

Frontend `.env`:
```
VITE_API_URL=http://localhost:5001
```

Production points to the deployed backend URL.

---

## 9. Frontend — Design System & Theming

### 9.1 Color Palette — "Midnight Aurora"

The design follows a **dark premium aesthetic** named "Midnight Aurora":

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#0A0F1C` | Dark base / button text on secondary |
| `secondary` | `#00E5A0` | Brand green / CTAs / accents / glows |
| `bg` | `#060B14` | Page background (near-black) |
| `card` | `#0D1424` | Card and panel backgrounds |
| `text` | `#E8ECF4` | Primary text color |
| `subtext` | `#6B7A99` | Secondary / muted text |
| `accent` | `#3B82F6` | Blue accent for secondary highlights |
| `success` | `#00E5A0` | Same as secondary |
| `error` | `#FF4D6A` | Error states / destructive actions |
| `surface` | `#111B2E` | Input backgrounds / subtle surfaces |
| `border` | `#1A2744` | Borders throughout |
| `glow` | `#00E5A0` | Glow effect base color |
| `glow-blue` | `#3B82F6` | Blue glow effect |

### 9.2 Typography

| Token | Font | Usage |
|-------|------|-------|
| `font-heading` | Instrument Serif (italic) | All headings, brand text |
| `font-body` | Space Grotesk | Body text, labels, UI elements |

Both loaded via Google Fonts CDN.

### 9.3 Custom CSS Utilities

| Class | Effect |
|-------|--------|
| `.glass` | Glassmorphism: 60% opacity `card` bg + 24px blur + border |
| `.glass-light` | Lighter glass: 35% opacity + 16px blur |
| `.glow-green` | Green box-shadow glow (40px + 80px) |
| `.glow-blue` | Blue box-shadow glow |
| `.text-glow` | Green text-shadow |
| `.text-glow-blue` | Blue text-shadow |
| `.grain::after` | Noise grain overlay using inline SVG (fractalNoise turbulence) |
| `.mesh-hero` | Multi-radial gradient hero backgrounds |
| `.mesh-card` | Subtle radial gradient on cards |
| `.divider-glow` | Linear gradient line (transparent → green → transparent) |
| `.skeleton` | Pulsing skeleton loading animation |
| `.animate-swipe-right` | Card flies right + rotates (swipe discovery) |
| `.animate-swipe-left` | Card flies left + rotates (swipe discovery) |
| `.custom-scrollbar` | Thin 4px scrollbar with themed colors |

---

## 10. Frontend — State Management (AuthContext)

### 10.1 AuthContext (`context/AuthContext.tsx`)

A React Context providing global authentication state:

**Interface**:
```typescript
interface User {
  id: number; name: string; email: string; role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
```

**Persistence**: Token and user object stored in `localStorage`. On mount, reads from localStorage to restore session.

**Key Computed Properties**:
- `isAuthenticated = !!token && !!user`
- `isAdmin = user?.role === 'admin'`

---

## 11. Frontend — API Layer

### 11.1 Axios Instance (`lib/api.ts`)

- Base URL from `VITE_API_URL` env var (fallback: `http://localhost:5001`)
- Request interceptor automatically attaches `Authorization: Bearer <token>` header from `localStorage`
- Used by all pages/components for API calls

---

## 12. Frontend — Shared Components

### 12.1 Navbar (`components/Navbar.tsx`)

Global sticky navigation bar with:
- **Logo**: "Bookdrop" in heading font with secondary-colored "drop"
- **Desktop nav links**: Shop, Marketplace, Bundles, Atlas, Eras, Swipe, Challenges, Quiz (each with Lucide icons)
- **Admin link**: Conditionally shown when `isAdmin`
- **User actions**: Wishlist (heart), Cart (bag with pulsing indicator), User profile (links to /orders), Logout
- **Mobile menu**: Hamburger toggle with slide-down nav list
- **Cart Drawer**: Opens `CartDrawer` component as overlay

### 12.2 CartDrawer (`components/CartDrawer.tsx`)

Slide-out drawer panel from the right:
- Fixed overlay with backdrop blur + opacity transition
- Shows cart items with cover images, titles, authors, quantities, prices
- Remove item functionality
- Total calculation displayed as "₹X.XX"
- "Initiate Checkout" CTA navigates to `/checkout`
- Empty state with "Vault is Empty" messaging
- Loading state with animated spinner
- Themed with the "literary sanctuary" aesthetic

### 12.3 ProtectedRoute (`components/ProtectedRoute.tsx`)

Route guard component:
- If not authenticated → redirect to `/login`
- If `adminOnly` prop and not admin → redirect to `/`
- Otherwise → render children

---

## 13. Frontend — All Pages (23 Pages)

### 13.1 Home (`Home.tsx`)
- **Hero section** with mesh gradient background, floating orbs (CSS), tagline "Swipe. Read. Trade. Every book has a journey."
- **CTAs**: "Start Swiping" → `/discover`, "Discovery Quiz" → `/quiz`
- **"Today's Picks"**: 4 randomly selected books from API with cover images, add-to-cart buttons
- **"Exclusive Bundles"**: Up to 2 bundles with stacked book covers, discount badges, "Add Bundle to Bag" (loops through books, adds each to cart)
- **"How It Works"**: 3-column feature grid (Community Trade, Trace the Journey, Read Together)

### 13.2 BookListing (`BookListing.tsx`)
- **Search bar** (search by title/author)
- **Category filter** dropdown
- **Sort by** dropdown (price asc/desc)
- **Book grid** (responsive: 1-4 columns)
- Each card: cover image, title, author, price, "Details" link, hover add-to-cart button

### 13.3 BookDetail (`BookDetail.tsx`)
- **Book info**: Cover image (2:3 aspect ratio with hover zoom), category badge, title, author, price, description
- **Quantity selector**: Increment/decrement with stock display
- **Actions**: "Add to Bag" button, "Sample" chapter link, wishlist heart toggle
- **Pre-loved Copies section**: Shows available second-hand copies (fetched from `/api/secondHand/book/:id`), each with condition badge, seller name, city, price, "Journey" link, "Buy Copy" button
- **Reviews section**: List of reviews (star ratings, reviewer name, date, text) + review submission form (rating stars, name, text)

### 13.4 ChapterReader (`ChapterReader.tsx`)
- Reads chapter content for a book/chapter number
- Free chapters show full content; paid chapters show locked notice

### 13.5 Login (`Login.tsx`)
- Themed login form ("Access Sanctum")
- Email + password fields with icons
- Show/hide password toggle
- On success: calls `login()` from AuthContext, navigates to `/`
- Link to Register page
- "End-to-End Encrypted" footer badge

### 13.6 Register (`Register.tsx`)
- Registration form (name, email, password)
- On success: navigates to `/login`
- Similar aesthetic to Login page

### 13.7 Cart (`Cart.tsx`)
- Full-page cart view (alternative to CartDrawer)
- Shows cart items with images, quantities, price calculations
- Checkout button

### 13.8 Checkout (`Checkout.tsx`)
- Two-column layout: Form (left) + Order Summary (right, sticky)
- **Address form**: Full name, phone, street, city, state, pincode (6 fields)
- **Payment section**: Mock "Sanctum Credits / Card" selector (no real payment integration)
- **Order summary**: Itemized list with quantities, base amount, "Protection Fee: Waived", total
- **Submit flow**: Creates address via `/api/addresses`, then places order via `/api/orders/place`
- On success: Navigates to `/order-success` with `?sh_ids=` query parameter for second-hand book IDs

### 13.9 OrderSuccess (`OrderSuccess.tsx`)
- Celebration page after successful order
- Shows order confirmation details
- If second-hand books were purchased, shows links to their journey timelines

### 13.10 MyOrders (`MyOrders.tsx`)
- Lists all user orders (newest first)
- Each order: order number, date, status badge, total amount
- Each order item: title, quantity, with hover-reveal actions:
  - "Course" link → `/course/:bookId`
  - "Return" button → opens refund modal
  - "View Journey" link (only for second-hand items) → `/journey/:shBookId`
- **Refund modal**: Textarea for reason, submit button, loading state

### 13.11 Wishlist (`Wishlist.tsx`)
- Grid of wishlisted books with cover images
- "Move to Cart" button per item (calls `/api/wishlist/cart`)
- Remove from wishlist button
- Book detail links

### 13.12 SwipePage (`SwipePage.tsx`)
- **Tinder-style card stack** interface
- Current book displayed with cover image, title, author, rating, price
- Next card visible behind (scaled down, lower opacity)
- **Actions**: X button (left swipe), BookOpen (view details), Heart (right swipe → adds to cart/wishlist)
- **Swipe animations**: CSS keyframes for fly-out with rotation
- **Overlay stamps**: "WISH" (green) on right swipe, "PASS" (red) on left swipe
- "All caught up" empty state when no more books

### 13.13 SellBook (`SellBook.tsx`)
- Form to list a pre-owned book for sale
- **Book selection**: Dropdown of all books from catalog
- **Condition selector**: Three-button toggle (Good / Fair / Worn)
- **Price input**: Numeric field with ₹ prefix
- Submits to `/api/secondHand/sell`
- On success: navigates to `/marketplace`

### 13.14 Marketplace (`Marketplace.tsx`)
- Grid of available second-hand books
- Each card: condition badge, "Journey" tag link, cover image, title, author, seller name + city, price
- **Actions per card**: "Details" link (to original book), "Buy" button (adds second-hand copy to cart), "Journey" link (to provenance timeline)
- "Sell a Book" CTA link

### 13.15 JourneyTimeline (`JourneyTimeline.tsx`)
- **Full provenance visualization** for a specific second-hand book copy
- Vertical timeline with central line (green gradient)
- Each ownership node: map pin icon, owner name, city, date (month+year), optional reader note (in a styled quote block)
- First/latest node highlighted with green glow
- "Active Orbit" indicator at bottom (current holder)
- **Sidebar**: "Most Travelled" leaderboard — top 10 book copies by number of ownership changes, with cover images and journey counts

### 13.16 ChallengesPage (`ChallengesPage.tsx`)
- List of reading challenges with:
  - Title, description, book count, duration, reward points
  - Progress bar (books_read / book_count)
  - "Join" button (if not joined)
  - "Completed" badge (if completed_at is set)

### 13.17 BundlesPage (`BundlesPage.tsx`)
- Grid of curated book bundles
- Each bundle: title, description, book covers (stacked), original price (strikethrough), discounted price, discount percentage badge
- "Add to Bag" button adds all books in bundle to cart

### 13.18 QuizPage (`QuizPage.tsx`)
- Multi-step quiz for book recommendations
- Client-side question flow with category/preference matching
- Suggests books based on answers

### 13.19 RoomInterface (`RoomInterface.tsx`)
- Read-together room chat interface
- Shows room messages with user names and timestamps
- Message input for sending chat messages
- Requires book ownership to join

### 13.20 WorldMap (`WorldMap.tsx`)
- **Interactive SVG world map** using `react-simple-maps` + world-atlas TopoJSON
- Click any country → fetches books from that country via `/api/discovery/map/:country`
- Selected country highlighted in green (`#00E5A0`), others in dark blue (`#1A2744`)
- Hover state in blue (`#3B82F6`)
- Below map: filtered book grid with covers, titles, prices, "Details" links, add-to-cart buttons
- "Clear" button to reset selection

### 13.21 TimeMachine (`TimeMachine.tsx`)
- **5 literary eras**: Ancient (0-500), Medieval (500-1500), Renaissance (1500-1800), Industrial (1800-1950), Modern (1950-2026)
- Horizontal era selector with icons, descriptions
- Selected era highlighted with green glow
- Below: filtered book grid from `/api/discovery/timeline/:start/:end`
- Each book shows published year ("Circa 1949")

### 13.22 CourseViewer (`CourseViewer.tsx`)
- Video course player for purchased books
- Lists courses from `/api/courses/:bookId`
- Embeds YouTube videos via React Player
- Purchase verification — non-owners see error

### 13.23 AdminDashboard (`AdminDashboard.tsx`)
- **Full administrative control panel** with sidebar navigation
- **8 tabs**: Analytics, Books, Users, Orders, Challenges, Bundles, Marketplace, Refunds

**Analytics Tab**:
- KPI cards: Revenue, Orders, Users, Books (with icons and formatted values)
- Weekly Revenue bar chart (Recharts)
- Category Sales breakdown with progress bars

**Books Tab**:
- Table of all books with cover thumbnails, category badges, price, stock, country
- "New Book" button opens form modal with product type toggle (First-Hand / Second-Hand)
- First-hand form: title, author, category, price, stock, cover URL, description
- Second-hand form: swaps stock for condition selector + seller city field
- Edit/Delete actions on hover

**Users Tab**: Table with name (avatar initial), email, role badge, join date. Edit role, delete user.

**Orders Tab**: Table with order #, customer info, total, order status badge, payment status badge. Edit statuses, delete order.

**Challenges Tab**: Table with title/description, book count, duration, reward points. Full CRUD.

**Bundles Tab**: Table with title, description, discount %. Full CRUD.

**Marketplace Tab**: Table with book title, seller, price, condition, status badge. Full CRUD. Creating a listing auto-creates the book if title+author doesn't exist.

**Refunds Tab**: Table with user, book, reason, status. PENDING items show Approve (✓) / Reject (✗) action buttons. One-click status update via inline API calls.

**Reusable Table Component**: The admin page includes an internal `Table` component accepting columns, rows, renderRow function, and optional onEdit/onDelete handlers. Actions appear on row hover.

**Universal Form Modal**: A single modal form adapts its fields based on the active tab (books, users, orders, challenges, bundles, marketplace). Handles both create and edit modes.

---

## 14. Frontend — Routing Architecture

### 14.1 Route Table

| Path | Page | Auth | Admin |
|------|------|------|-------|
| `/` | Home | ❌ | ❌ |
| `/books` | BookListing | ❌ | ❌ |
| `/books/:id` | BookDetail | ❌ | ❌ |
| `/chapters/:bookId/:chapterNum` | ChapterReader | ❌ | ❌ |
| `/login` | Login | ❌ | ❌ |
| `/register` | Register | ❌ | ❌ |
| `/map` | WorldMap | ❌ | ❌ |
| `/time-machine` | TimeMachine | ❌ | ❌ |
| `/quiz` | QuizPage | ❌ | ❌ |
| `/bundles` | BundlesPage | ❌ | ❌ |
| `/cart` | Cart | ✅ | ❌ |
| `/checkout` | Checkout | ✅ | ❌ |
| `/order-success` | OrderSuccess | ✅ | ❌ |
| `/orders` | MyOrders | ✅ | ❌ |
| `/discover` | SwipePage | ✅ | ❌ |
| `/wishlist` | Wishlist | ✅ | ❌ |
| `/sell` | SellBook | ✅ | ❌ |
| `/marketplace` | Marketplace | ✅ | ❌ |
| `/journey/:shBookId` | JourneyTimeline | ✅ | ❌ |
| `/challenges` | ChallengesPage | ✅ | ❌ |
| `/rooms/:roomId` | RoomInterface | ✅ | ❌ |
| `/course/:bookId` | CourseViewer | ✅ | ❌ |
| `/admin` | AdminDashboard | ✅ | ✅ |

---

## 15. Feature Module Deep Dives

### 15.1 Book Journey / Provenance System

**Purpose**: Track the ownership history of every physical copy of a second-hand book.

**Data Flow**:
1. **Listing**: User lists a book via `/api/secondHand/sell` → creates `second_hand_books` record with status=AVAILABLE
2. **Purchase**: Buyer checks out → `orders.js` sets status=SOLD, creates first `book_journey` entry with buyer's city (from shipping address)
3. **Resale**: New owner lists the same copy again → cycle repeats for each new buyer
4. **Notes**: Any owner can add a personal note via `POST /api/journey/note` (verified as most recent owner)
5. **Visualization**: `JourneyTimeline.tsx` renders the vertical timeline with all ownership nodes

**Schema**:
```sql
book_journey (
  id, sh_book_id FK→second_hand_books, owner_id FK→users,
  city VARCHAR, note TEXT, owned_from TIMESTAMP DEFAULT NOW()
)
```

### 15.2 Swipe Discovery Engine

**Purpose**: Tinder-for-books interface to engage users in discovering new books.

**Flow**:
1. `GET /api/swipes/feed` returns books the user hasn't swiped (LEFT JOIN exclusion, random order, limit 10)
2. Frontend renders card stack with current + next card
3. Right swipe → `POST /api/swipes` with action=RIGHT → records swipe + auto-adds to wishlist
4. Left swipe → records swipe only (skip)
5. CSS animations handle fly-out with rotation

### 15.3 Bundle Discount System

**Two types of discounts**:

1. **Curated Bundles** (admin-created): Fixed collections with admin-set discount percentages. Frontend shows original vs discounted price.

2. **Cart-Size Dynamic Discounts** (automatic at checkout):
   - 3+ items → 5% off
   - 5+ items → 10% off
   - 10+ items → 15% off
   - Applied in `orders.js` during order placement

### 15.4 Challenge Gamification

**Lifecycle**:
1. Admin creates challenges with target book_count, duration, reward_points, optional target_category
2. Users join challenges (creates `user_challenges` record with `books_read=0`)
3. On purchase, `orders.js` auto-increments `books_read` for all active user_challenges where:
   - Challenge not completed
   - Book category matches target_category (or target_category is NULL for general challenges)
4. When `books_read >= book_count`, user can claim completion → receives reward_points

### 15.5 Read Together Rooms

**Flow**:
1. User must own the book (verified via order_items)
2. POST `/api/rooms/join` with book_id + optional invite_code
3. If invite_code provided → joins existing room
4. If no code → creates new room with random 6-char code
5. Messages fetched via GET `/:roomId/messages` (polling-based, not WebSocket)

---

## 16. Database Migration Strategy

The database evolved through multiple phases:

| Migration File | Changes |
|---------------|---------|
| `schema.sql` | Base schema: users, addresses, books, chapters, cart, cart_items, orders, order_items, wishlist, user_swipes, second_hand_books, challenges, user_challenges, bundles, bundle_books, read_together_rooms, room_members, room_messages |
| `migrate-phase3.js` | Second-hand marketplace & book journey tables |
| `migrate-phase4.js` | `users.points` column; challenges, user_challenges, bundles, bundle_books, read_together_rooms, room_members, room_messages tables |
| `migrate-phase5.js` | `users.role` ENUM(user,admin); `books.country`, `books.published_year`; reviews, refund_requests, courses tables; admin user seed |
| `migrate-inr.js` | Price conversion (USD→INR); cover image fix (reliable OpenLibrary URLs); addresses table check; role column check; second_hand_books prices update |

---

## 17. Data Seeding & Demo Accounts

### 17.1 Seed Data (`seed.js`)

The seed script populates the database with production-quality demo data:

| Entity | Count | Notes |
|--------|-------|-------|
| Users | 6 | 1 admin + 5 regular users |
| Books | 30 | Real classic and modern titles with OpenLibrary covers |
| Chapters | 15 | 3 chapters each for first 5 books (ch1 free) |
| Addresses | 5 | Global cities (Bangalore, San Francisco, London, New Delhi, Madrid) |
| Orders | 6 | With mixed items, DELIVERED status |
| Reviews | 15 | Realistic multi-paragraph reviews |
| Second-Hand Listings | 8 | Various conditions |
| Challenges | 6 | Themed challenges with different durations/targets |
| User Challenges | 4 | Mix of in-progress and completed |
| Bundles | 4 | Themed collections with 12-20% discounts |
| Courses | 5 | YouTube video URLs linked to popular books |
| Reading Rooms | 3 | With invite codes and initial messages |
| Wishlists | 3 users | 8 total entries |
| Book Journey | 3 | Sample provenance entries with notes |

### 17.2 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@bookdrop.com | admin123 |
| **User** | arjun@example.com | password123 |
| **User** | sophia@example.com | password123 |
| **User** | marcus@example.com | password123 |
| **User** | priya@example.com | password123 |
| **User** | elena@example.com | password123 |

### 17.3 Book Catalog Categories

9 categories: Fiction, Sci-Fi, Romance, Philosophy, Non-Fiction, Thriller, Self-Help, Fantasy

### 17.4 Book Catalog Countries

12 countries: USA, UK, Colombia, Brazil, Israel, Japan, Russia, Afghanistan, Canada, Nigeria, Germany, Australia, Iran

---

## 18. Security Implementation

### 18.1 Authentication

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Tokens**: Signed with `JWT_SECRET`, 1-hour expiry
- **Token Payload**: `{id, name, role}`
- **Client Storage**: `localStorage` (token + user JSON)
- **Auto-Attachment**: Axios interceptor adds `Authorization: Bearer <token>` to all requests

### 18.2 Authorization

- **Route-Level**: `authMiddleware` validates JWT on every protected route
- **Role-Based**: `adminMiddleware` checks `req.user.role === 'admin'`
- **Resource Ownership**: Many routes verify ownership (e.g., addresses owned by user, book_journey most recent owner)
- **Purchase Verification**: Reviews, courses, and room access verify the user has purchased the book (JOIN through order_items + orders)

### 18.3 CORS

Restricted to:
- `https://bookdrop-delta.vercel.app` (production)
- `http://localhost:5173` (development)

Methods: GET, POST, PUT, DELETE, OPTIONS  
Headers: Content-Type, Authorization  
Credentials: enabled

### 18.4 Data Integrity

- **Transactions**: Order placement uses MySQL transactions with rollback on failure
- **Row Locking**: `FOR UPDATE` locks on stock/availability checks during order placement
- **Duplicate Prevention**: `INSERT IGNORE` for swipes, wishlists. UNIQUE constraints on email, invite_codes.
- **Price Snapshot**: Cart items capture price at add-time, preventing price manipulation
- **Input Validation**: Backend validates required fields, checks for existence of referenced entities

---

## 19. Deployment Architecture

### 19.1 Frontend Deployment (Vercel)

- **Platform**: Vercel
- **URL**: https://bookdrop-delta.vercel.app
- **Build**: `tsc -b && vite build` → outputs to `dist/`
- **SPA Routing**: `vercel.json` rewrites all routes to `index.html`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **Analytics**: @vercel/analytics injected at startup

### 19.2 Backend Deployment

The backend is designed to run on any Node.js hosting platform (Railway, Render, DigitalOcean, etc.):
- Entry: `node server.js` (production) or `nodemon server.js` (dev)
- Port configurable via `PORT` env var
- Database connection via environment variables

### 19.3 Database Hosting

MySQL database hosted externally (e.g., Aiven, PlanetScale, or local MySQL). Connection via:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` environment variables

---

## 20. UI/UX Design Philosophy

### 20.1 Design Theme

**"Literary Sanctuary"** — A mystical, premium dark-mode aesthetic that treats books as sacred artifacts. Key visual language:

- **Theming**: Dark near-black backgrounds with emerald green (`#00E5A0`) as the primary accent
- **Typography**: Serif italic headings (Instrument Serif) create an "ancient library" feel; Sans-serif body (Space Grotesk) provides modern readability
- **Glows & Glass**: Liberal use of green glow effects on CTAs and glassmorphic panels with backdrop blur
- **Grain Overlay**: Subtle film-grain noise overlay (via SVG filter) on certain sections
- **Micro-interactions**: Hover scale transforms on cards, opacity transitions on action buttons, rotate transitions on close buttons

### 20.2 Language & Copy

The UI uses a distinctive literary/mystical vocabulary:
- Login → "Access Sanctum" / "Enter Sanctuary"
- Cart → "Your Bag" / "Vault"
- Checkout → "Finalize Ritual"
- Total → "Total Sacrifice"
- Password → "Secret Key"
- Email → "Archive Identity"
- Address → "Sanctuary Address"
- City → "Citadel"
- Pincode → "Postal Sigil"
- Sell → "Relinquish Volume"
- Book condition → "Vessel Condition"
- Book Journey → "Provenance Record"

### 20.3 Responsive Design

- TailwindCSS responsive prefixes throughout (`sm:`, `md:`, `lg:`, `xl:`)
- Mobile hamburger menu in Navbar
- Grid layouts adapt from 1 to 4 columns
- CartDrawer is full-width on mobile, max-w-md on desktop
- AdminDashboard has fixed sidebar (desktop-focused)

---

## 21. Complete API Reference

### 21.1 Base URL
- Development: `http://localhost:5001`
- Production: (deployed backend URL)

### 21.2 Authentication Header
```
Authorization: Bearer <jwt_token>
```

### 21.3 Full Endpoint List

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me                          [Auth]

GET    /api/addresses                        [Auth]
POST   /api/addresses                        [Auth]
PUT    /api/addresses/:id                    [Auth]
DELETE /api/addresses/:id                    [Auth]

GET    /api/books
GET    /api/books/:id
POST   /api/books                            [Admin]
PUT    /api/books/:id                        [Admin]
DELETE /api/books/:id                        [Admin]

GET    /api/chapters/:bookId

GET    /api/cart                             [Auth]
POST   /api/cart/add                         [Auth]
PUT    /api/cart/update/:itemId              [Auth]
DELETE /api/cart/remove/:itemId              [Auth]

POST   /api/orders/place                     [Auth]
GET    /api/orders                           [Auth]
GET    /api/orders/user                      [Auth]

GET    /api/wishlist                         [Auth]
DELETE /api/wishlist/:bookId                 [Auth]
POST   /api/wishlist/cart                    [Auth]

POST   /api/swipes                           [Auth]
GET    /api/swipes/feed                      [Auth]

GET    /api/secondHand
POST   /api/secondHand/sell                  [Auth]
GET    /api/secondHand/book/:bookId

GET    /api/journey/:shBookId
GET    /api/journey/leaderboard/most-travelled
POST   /api/journey/note                     [Auth]

GET    /api/challenges                       [Auth]
POST   /api/challenges/join                  [Auth]
POST   /api/challenges/complete              [Auth]

GET    /api/bundles
POST   /api/bundles/custom-discount          [Auth]

POST   /api/rooms/join                       [Auth]
GET    /api/rooms/:roomId/messages           [Auth]

GET    /api/discovery/map/:country
GET    /api/discovery/timeline/:start/:end
GET    /api/discovery/countries

POST   /api/reviews                          [Auth]
GET    /api/reviews/:bookId

POST   /api/refunds/request                  [Auth]
GET    /api/refunds/my-requests              [Auth]

GET    /api/courses/:bookId                  [Auth]

GET    /api/admin/stats                      [Admin]
GET    /api/admin/refunds                    [Admin]
PUT    /api/admin/refunds/:id                [Admin]
GET    /api/admin/users                      [Admin]
PUT    /api/admin/users/:id                  [Admin]
DELETE /api/admin/users/:id                  [Admin]
GET    /api/admin/orders                     [Admin]
PUT    /api/admin/orders/:id                 [Admin]
DELETE /api/admin/orders/:id                 [Admin]
GET    /api/admin/challenges                 [Admin]
POST   /api/admin/challenges                 [Admin]
PUT    /api/admin/challenges/:id             [Admin]
DELETE /api/admin/challenges/:id             [Admin]
GET    /api/admin/bundles                    [Admin]
POST   /api/admin/bundles                    [Admin]
PUT    /api/admin/bundles/:id                [Admin]
DELETE /api/admin/bundles/:id                [Admin]
GET    /api/admin/marketplace                [Admin]
POST   /api/admin/marketplace                [Admin]
PUT    /api/admin/marketplace/:id            [Admin]
DELETE /api/admin/marketplace/:id            [Admin]
GET    /api/admin/rooms                      [Admin]
DELETE /api/admin/rooms/:id                  [Admin]
```

**Total: 55 API endpoints**

---

## 22. Entity-Relationship Summary

### Core Entities and Their Fields

**users**: id, name, email, password, role (user/admin), points, created_at

**books**: id, title, author, description, price, stock, cover_image, category, country, published_year, created_at

**addresses**: id, user_id FK, full_name, phone, street, city, state, pincode, is_default

**cart**: id, user_id FK, created_at

**cart_items**: id, cart_id FK, book_id FK, quantity, price, is_second_hand, sh_book_id

**orders**: id, user_id FK, address_id FK, total_amount, payment_status, order_status, created_at

**order_items**: id, order_id FK, book_id FK, quantity, price, is_second_hand, sh_book_id

**chapters**: id, book_id FK, chapter_number, content (LONGTEXT), is_free

**wishlist**: id, user_id FK, book_id FK, created_at (UNIQUE: user_id,book_id)

**user_swipes**: id, user_id FK, book_id FK, action ENUM(RIGHT,LEFT,UP,DOWN), created_at (UNIQUE: user_id,book_id)

**second_hand_books**: id, book_id FK, seller_id FK, price, condition_desc, status (AVAILABLE/SOLD), created_at

**book_journey**: id, sh_book_id FK, owner_id FK, city, note, owned_from

**challenges**: id, title, description, book_count, duration_days, reward_points, target_category

**user_challenges**: id, user_id FK, challenge_id FK, books_read, joined_at, completed_at

**bundles**: id, title, description, discount_percent, created_at

**bundle_books**: id, bundle_id FK, book_id FK

**read_together_rooms**: id, book_id FK, created_by FK, invite_code (UNIQUE)

**room_members**: id, room_id FK, user_id FK, current_chapter

**room_messages**: id, room_id FK, user_id FK, message, sent_at

**reviews**: id, book_id FK, name, review_text, rating (1-5), created_at

**refund_requests**: id, user_id FK, book_id FK, order_id FK, reason, status (PENDING/APPROVED/REJECTED), requested_at

**courses**: id, book_id FK, title, video_url, description

---

## 23. Key Business Logic & Algorithms

### 23.1 Order Placement (Transactional)
```
BEGIN TRANSACTION
  1. Validate cart is non-empty
  2. For each item: lock row + verify availability/stock
  3. Calculate total
  4. Apply bulk discount (3+=5%, 5+=10%, 10+=15%)
  5. Create order record
  6. For each item:
     a. Create order_item
     b. If second-hand: mark SOLD, create journey entry
     c. If first-hand: decrement stock, update challenge progress
  7. Clear cart
COMMIT (or ROLLBACK on any error)
```

### 23.2 Swipe Feed Algorithm
```sql
SELECT b.* FROM books b
LEFT JOIN user_swipes us ON b.id = us.book_id AND us.user_id = ?
WHERE us.id IS NULL
ORDER BY RAND()
LIMIT 10
```
Returns random books the user hasn't interacted with yet.

### 23.3 Challenge Auto-Progress
On book purchase, the system auto-increments `books_read` for all matching active user_challenges:
```sql
UPDATE user_challenges uc
JOIN challenges c ON uc.challenge_id = c.id
SET uc.books_read = uc.books_read + ?
WHERE uc.user_id = ? 
  AND uc.completed_at IS NULL
  AND (c.target_category IS NULL OR c.target_category = (SELECT category FROM books WHERE id = ?))
```

### 23.4 Most Travelled Leaderboard
```sql
SELECT sh.id, b.title, b.author, b.cover_image, COUNT(bj.id) as journeys
FROM second_hand_books sh
JOIN books b ON sh.book_id = b.id
JOIN book_journey bj ON sh.id = bj.sh_book_id
GROUP BY sh.id
ORDER BY journeys DESC LIMIT 10
```

### 23.5 Wishlist-to-Cart (Atomic)
Uses explicit MySQL transaction:
1. Verify item is in wishlist
2. Lookup book price
3. Get or create cart
4. Add to cart (increment if exists, insert if not)
5. Remove from wishlist
6. COMMIT

---

## 24. Known Limitations & Future Scope

### 24.1 Current Limitations

1. **No Real Payment Gateway**: Checkout uses mock payment flow; no Razorpay/Stripe integration
2. **No WebSocket Chat**: Reading rooms use HTTP polling, not real-time WebSocket
3. **No Image Upload**: Book covers are URLs (OpenLibrary); no local file upload/S3
4. **No Email Notifications**: No transactional emails for orders, refunds, etc.
5. **No Pagination**: Book listings and admin tables load all records at once
6. **No Rate Limiting**: API has no rate limiting or request throttling
7. **Session Management**: Uses localStorage (XSS-vulnerable); no httpOnly cookie option
8. **No Search Indexing**: Book search uses SQL `LIKE %search%` (no full-text/Elasticsearch)
9. **Admin Dashboard**: Desktop-only layout; not responsive on mobile

### 24.2 Future Scope

1. **Payment Integration**: Razorpay/Stripe for real transactions
2. **WebSocket Chat**: Socket.io for real-time reading room messaging
3. **AI Recommendations**: ML-based book suggestions using swipe history and purchase patterns
4. **Social Features**: Follow readers, share wishlists, book clubs
5. **Mobile App**: React Native version of the platform
6. **Notification System**: Email + push notifications for order updates, challenge deadlines
7. **Advanced Analytics**: User behavior tracking, A/B testing for recommendation algorithms
8. **Internationalization**: Multi-language support (i18n)
9. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
10. **SEO**: Server-side rendering (Next.js migration) for better search engine crawling

---

## Appendix A: Running the Project Locally

### Backend Setup
```bash
cd backend
npm install
# Create .env from .env.example
# Run database schema: mysql < schema.sql
node migrate-phase4.js
node migrate-phase5.js
node migrate-inr.js
node seed.js
npm run dev   # starts nodemon on port 5001
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:5001
npm run dev   # starts Vite dev server on port 5173
```

### Build for Production
```bash
cd frontend
npm run build   # outputs to dist/
```

---

*End of Document — Total coverage: 22 tables, 55 API endpoints, 23 frontend pages, 3 components, complete design system, all business logic, deployment config, and seed data.*
