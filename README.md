# WedPlan Client — Wedding Planning Platform

A modern, responsive, role-based wedding planning web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## 📌 Project Overview
WedPlan is an all-in-one wedding marketplace enabling engaged couples to discover, filter, and request bookings for verified wedding services (venues, photographers, decorators, caterers, stylists, and fashion). Vendors manage their portfolios with tier limits, review incoming proposals, and upgrade to Premium via Stripe. Platform administrators supervise users, moderate services, and review platform revenue.

- **Client Repository**: [https://github.com/DeeDee001/WedPlan-Client](https://github.com/DeeDee001/WedPlan-Client)
- **Server Repository**: [https://github.com/DeeDee001/WedPlan-Server](https://github.com/DeeDee001/WedPlan-Server)
- **Live Deployment**: Coming soon / Deployment URL

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (React 19, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Animations**: Framer Motion
- **Feedback & Notifications**: Sonner Toast System
- **State Management**: React Context (`AuthContext`) with persistent session tokens
- **Media Hosting**: ImgBB API Integration

---

## ✨ Features & Architecture

### 1. Public Pages
- **Home (`/`)**:
  - Wedding-themed hero banner with dynamic call-to-actions.
  - Featured wedding services showcase (fetching active/approved listings).
  - 6 wedding categories with deep links (`Photography & Videography`, `Wedding Venues`, `Decoration & Florist`, `Catering Services`, `Makeup & Styling`, `Wedding Fashion`).
  - "Why Choose WedPlan", "How WedPlan Works", and verified couple testimonials.
  - Framer motion scroll reveals and responsive layout.
- **Browse Services (`/services`)**:
  - Live title and description search.
  - Category and location-based filtering.
  - **Price sorting** (Ascending and Descending).
  - Empty states, loading indicators, and unauthenticated redirect guard.
- **Service Details (`/services/[id]`)**:
  - Multi-image gallery with active zoom thumbnail selector.
  - Comprehensive service descriptions and vendor credentials.
  - Modal booking request form preventing double-bookings on identical dates.

### 2. Authentication System (`/signin`, `/signup`)
- **Better Auth & JWT Integration**:
  - Secure credential signup with role choice (`Customer` or `Vendor`).
  - Validation: Min 6 characters, 1 uppercase, 1 lowercase letter.
  - ImgBB avatar file upload integration.
  - Admin accounts blocked from public signups.
  - Fast role-based redirection post-login (`/dashboard/admin`, `/dashboard/vendor`, `/dashboard/customer`).
  - Responsive navbar with instant avatar/session state updates and profile dropdown.

### 3. Customer Dashboard (`/dashboard/customer`)
- **Overview**: Real-time stats (Total Requests, Pending, Accepted, Rejected).
- **My Bookings (`/dashboard/customer/bookings`)**:
  - View all event dates, locations, messages, and vendor contacts.
  - Cancel pending booking requests safely.

### 4. Vendor Dashboard (`/dashboard/vendor`)
- **Overview**: Stats on active services, pending bookings, and subscription status.
- **Add Service (`/dashboard/vendor/services/add`)**:
  - ImgBB image upload.
  - Free tier limit enforcement (max 3 active services).
  - Prompts vendor to upgrade to Premium when limit reached.
- **My Services (`/dashboard/vendor/services`)**:
  - Edit service details, toggle active/inactive status, or delete listings.
- **Booking Requests (`/dashboard/vendor/bookings`)**:
  - Accept or Reject pending requests with state lock.
- **Subscription Plans (`/dashboard/vendor/subscription`)**:
  - Free vs Premium tier comparison.
  - Stripe Checkout redirection.

### 5. Admin Dashboard (`/dashboard/admin`)
- **Overview**: Platform-wide metrics (Total Users, Vendors, Customers, Services, Transactions).
- **Manage Users (`/dashboard/admin/users`)**: Search, role filtering, block/unblock accounts.
- **Manage Services (`/dashboard/admin/services`)**: Moderate pending listings, approve, reject, or delete.
- **Transactions (`/dashboard/admin/transactions`)**: Audit verified Stripe payments.

---

## 🔐 Environment Variables
Create `.env` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/DeeDee001/WedPlan-Client.git
cd WedPlan-Client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Evaluation Credentials
- **Admin Email**: `admin@wedplan.com`
- **Admin Password**: `Admin123!`

