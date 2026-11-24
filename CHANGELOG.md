# CampusCare — Version History & Release Registry

This document maintains an immutable audit trail of every major and minor release of **CampusCare**, including corresponding Git tags, commit hashes, feature additions, and instructions for rolling back to any previous state.

---

## 📌 Current Live Version: `v2.4.4` (Production Ready)
- **Git Tag:** `v2.4.4`
- **Release Date:** November 24, 2026
- **Status:** Active in Production ([Live Deployment](https://campuscare-livid.vercel.app/))

---

### [v2.4.4] — Home Page Mobile Layout & Floating Help Widget Overhaul
- **Tag:** `v2.4.4`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Sleek Circular Floating Action Button on Mobile (`SupportChatWidget.jsx` & `index.css`):**
    - Converted wide 170px horizontal pill into a clean 48px circular dark-glass action button (`width: 48px; height: 48px; border-radius: 50%`) with the headphones icon and green active dot on mobile viewports (< 640px).
    - Prevents the floating widget from ever covering CTA buttons or page content while preserving the full pill on desktop.
  - **Home Page Hero Mobile Structure Overhaul (`HomePage.jsx` & `index.css`):**
    - Placed primary CTA buttons (`Lodge a Complaint` and `Portal Sign In`) directly beneath the subtitle.
    - On mobile (< 640px), CTAs render as a neat 2-column grid (`grid-template-columns: 1fr 1fr; gap: 0.65rem`), saving over 60px of vertical height.
    - Moved the Quick Ticket Lookup search bar below the CTAs as an unobtrusive secondary utility with dedicated fluid class `.hero-ticket-search`.
    - Reduced `.editorial-hero` top padding from `4.5rem` (72px) down to `1.75rem` (28px) on mobile, eliminating massive wasted white space.
  - **Hero Visual Responsiveness (`ImageWithSkeleton.jsx` & `HomePage.jsx`):**
    - Removed hardcoded inline `height: 380` on the image container and added `containerClassName="hero-image-container"`.
    - Handled dynamically in CSS: 380px on desktop, 280px on tablet, and 210px on mobile with 12px rounded corners, fully displaying the campus photo without awkward clipping.

---

### [v2.4.3] — Senior Frontend Multi-Device Polish & Responsive Ergonomics
- **Tag:** `v2.4.3`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Admin Dashboard Table Hardening (`AdminDashboard.jsx`):**
    - Added `.col-hide-mobile` progressive disclosure to Location and Date columns on Live Grievance Dispatch Feed, aligning with other tables and eliminating horizontal blowout on narrow mobile devices.
  - **Metric Grid Layout Balance (`index.css`):**
    - Applied `.admin-metric-grid .metric-card:last-child:nth-child(odd) { grid-column: span 2; }` so the 5th KPI card spans 2 columns on mobile (381px–640px) instead of leaving an unbalanced single orphan card.
  - **Admin Support Reply Bar Mobile Ergonomics (`AdminSupportPage.jsx` & `index.css`):**
    - Introduced `.admin-reply-form`, `.admin-reply-input`, and `.admin-reply-btn`.
    - Under 480px, button collapses text to icon-only with `0.75rem 0.85rem` padding, giving maximum horizontal typing width on small screens and locking input font to 16px to prevent iOS auto-zoom.
  - **Student Profile Header Mobile Refinement (`StudentProfilePage.jsx`):**
    - Profile picture action buttons allow `flex-wrap: wrap` to prevent clipping when student name and verification badges wrap on small viewports.
  - **Global Theme Token Fallbacks (`index.css`):**
    - Defined standard `--foreground`, `--border`, `--muted`, `--background` aliases in `:root` for cross-component and markdown compatibility.

---

### [v2.4.2] — Full-Spectrum Mobile & Multi-Screen Responsive Hardening
- **Tag:** `v2.4.2`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Comprehensive Responsive CSS Pass (`index.css`):**
    - Added complete breakpoint coverage: 1400px (wide), 1024px (laptop), 768px (tablet portrait), 640px (phone), 480px (narrow phone), 380px (iPhone SE / Galaxy compact)
    - Landscape orientation guard (`max-height: 500px`) prevents hero overflow on rotated phones
    - iOS Safe Area Inset support (`env(safe-area-inset-*)`) for Dynamic Island, notch, and home bar across all sticky/floating elements
    - All interactive elements enforced to minimum 44px touch target on mobile (WCAG 2.1 AA compliant)
    - iOS Safari auto-zoom prevention on input focus (`font-size: 16px !important`)
    - Print stylesheet: hides sidebar, topbar, and floating widgets for clean prints
  - **Viewport Meta Hardening (`index.html`):**
    - Added `viewport-fit=cover` for iPhone notch/Dynamic Island safe areas
    - Added `theme-color`, `apple-mobile-web-app-capable`, and status bar meta tags for PWA-ready behaviour
  - **Dashboard Tables — `col-hide-mobile` Progressive Disclosure:**
    - `StudentDashboard`: Location and Date columns hidden on ≤ 480px; always-scrollable via `table-responsive`
    - `AdminManageComplaintsPage`: Category, Location, Submitted columns hidden on mobile; core info always visible
    - `MyComplaintsPage`: Same progressive disclosure applied
    - `AdminManageStudentsPage`: Email, Registered Date, Status Breakdown hidden on mobile
  - **Student Dashboard Banner (`StudentDashboard.jsx`):**
    - Black hero banner padding converted to `clamp()` fluid values — no overflow on 320px screens
  - **Submit Complaint Page (`SubmitComplaintPage.jsx`):**
    - Category picker grid: `minmax(140px → 130px)` and assigned `category-picker-grid` class for breakpoint overrides
    - Submit actions row: `flex-wrap: wrap` ensures buttons stack on very narrow viewports
  - **Forgot Password & Register Pages:**
    - OTP delivery method selector: replaced `1fr 1fr` with `repeat(auto-fit, minmax(140px, 1fr))` — stacks cleanly on iPhone SE
  - **Support Chat Widget (`SupportChatWidget.jsx`):**
    - Added mobile drag handle indicator (pill bar) at top of bottom-sheet on screens ≤ 640px
  - **Admin Complaints Status Tabs:**
    - Already had `overflowX: auto` — now enhanced with `-webkit-overflow-scrolling: touch` and `scroll-snap-type: x mandatory` on table

---
- **Key Focus:** Comprehensive device-adaptive responsiveness across all screen sizes (mobile < 640px, tablet 640px–1024px, desktop), mobile bottom-sheet modals, and fluid touch layouts.

---

## 🗂️ Version Archive & Changelog

### [v2.4.1] — Senior Frontend Responsive Architecture & Fluid Touch Layouts
- **Tag:** `v2.4.1`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Mobile Bottom-Sheet Modals (`index.css`):**
    - Redesigned `.modal-container` to automatically transform into a fluid bottom-sheet on screens <= 640px (`border-radius: 20px 20px 0 0`, `max-height: 92dvh`), eliminating clipped modal content on small viewports.
  - **Help & Services Widget Mobile Adaptation (`SupportChatWidget.jsx` & `index.css`):**
    - Converted the floating chat modal into a native full-width bottom sheet on mobile screens (< 640px).
    - Repositioned the floating action button to `bottom: 16px; right: 16px` to prevent viewport collisions.
  - **Admin Support Desk Multi-Device Grid (`AdminSupportPage.jsx`):**
    - Replaced rigid inline 2-column styles with responsive `.admin-support-container` that automatically stacks into a mobile-friendly view on tablets and mobile screens (< 900px).
  - **Student Profile Responsive Stacking (`StudentProfilePage.jsx`):**
    - Converted rigid inline grid to `.profile-grid-2col`, allowing personal info and security cards to stack cleanly below 960px.
  - **Password Strength & Metrics Fluid Wrap (`PasswordStrengthIndicator.jsx` & `AdminManageStudentsPage.jsx`):**
    - Reduced minimum checklist item widths to `130px` to guarantee seamless multi-column rendering on narrow devices like iPhone SE.

---

### [v2.4.0] — Help & Services Member Gate, Dashboard Chat Continuity & 24h Auto-Purge
- **Tag:** `v2.4.0`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Automatic 24-Hour Chat Purging (`SupportMessage.js` & `supportController.js`):**
    - Configured MongoDB TTL index `{ createdAt: 1 }, { expireAfterSeconds: 86400 }` to automatically and permanently purge chat documents older than 24 hours.
    - Proactive query-level cleanup guarantees zero bloat and optimized database storage in MongoDB Atlas.
    - Added 24-hour auto-delete security notices to students in the chat UI.
  - **Mandatory Sign-In Gate (`SupportChatWidget.jsx`):**
    - Help & Services button opens a dedicated sign-in gate for unauthenticated users, directing students to log in before chatting with administrators.
    - API endpoints (`GET /api/support/messages`, `POST /api/support/message`) strictly protected with JWT authentication middleware.
  - **Student Dashboard Chat Continuity (`DashboardLayout.jsx`):**
    - Embedded the floating Help & Services icon directly onto the Student Dashboard (`/student/dashboard`).
    - Bound conversation sessions permanently to the student's authenticated user ID (`user_${user._id}`), enabling seamless continuation of discussions with university administrators.

---

### [v2.3.0] — Floating Help & Support Desk, Automated Knowledge Bot & Live Admin Chat
- **Tag:** `v2.3.0`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Support Chat Engine & Models (`SupportMessage.js` & `supportController.js`):**
    - Created high-performance `SupportMessage` collection indexed on `sessionId` and timestamp.
    - Built dual-mode knowledge bot: matches user keywords or delivers instant structured answers with direct links if administrators are offline.
    - Built Admin conversation aggregation endpoint with unread count tracking.
  - **Home Page Floating Action Widget (`SupportChatWidget.jsx`):**
    - Added bottom-right floating pill button with real-time status indicator.
    - Two-tab interface:
      1. **Instant Answers (FAQ Bot):** Instant answers for frequent questions (how to lodge complaints, turnaround times, password reset, emergency helplines, editing profile pictures, tracking status).
      2. **Live Admin Chat:** Real-time messaging channel with automatic 3.5s background polling, seamless guest/student identification, and message history.
  - **Admin Live Support Operations Center (`AdminSupportPage.jsx`):**
    - Two-pane workspace in Admin portal (`/admin/support`).
    - Left pane: Live inquiry thread list with student name, role badge, email, unread counters, and search.
    - Right pane: Full conversation stream, quick 1-click canned responses, and custom reply dispatcher.
  - **Navigation Integration:**
    - Embedded floating widget onto Home Page (`HomePage.jsx`).
    - Added "Live Support Desk" to Admin sidebar navigation in `DashboardLayout.jsx`.

---

### [v2.2.1] — Strong Password Enforcement & Real-Time Strength Meter
- **Tag:** `v2.2.1`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Backend Strong Password Enforcement (`authController.js` & `User.js`):**
    - Built unified `validateStrongPassword` policy requiring: minimum 8 characters, at least 1 uppercase letter (`A-Z`), at least 1 lowercase letter (`a-z`), at least 1 numeric digit (`0-9`), and at least 1 special symbol (`!@#$%^&*()_+-=[]{};':"|,.<>/?~`).
    - Enforced on `registerUser` (`POST /api/auth/register`), `resetPassword` (`POST /api/auth/reset-password`), and `updateProfile` (`PUT /api/auth/profile`).
    - Updated Mongoose `User` schema minimum password length from 6 to 8 characters.
  - **Live Password Strength Indicator (`PasswordStrengthIndicator.jsx`):**
    - Created reusable component rendering an animated multi-level strength bar (Weak, Moderate, Strong) and 5 live rule verification badges.
    - Embedded across Student Registration (`RegisterPage.jsx`), Password Recovery (`ForgotPasswordPage.jsx`), and Student Profile Settings (`StudentProfilePage.jsx`).
  - **UI Polish:**
    - Cleaned modal button in Admin Student Directory from "Close Dossier" to "Close" and title to "Student Profile".

---

### [v2.2.0] — Student Profile Management, Avatar / DP Uploads & Admin Profile Dossier
- **Tag:** `v2.2.0`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **User Schema Extensions (`User.js`):** Added `avatar` (URL/base64 string), `department` (academic department), and `bio` (campus residence or personal bio) fields to the MongoDB User schema.
  - **Profile Management API (`authController.js` & `authRoutes.js`):**
    - `PUT /api/auth/profile`: Securely update personal details (name, phone, department, bio) and optional password change with current password verification.
    - `POST /api/auth/profile/avatar`: Memory-stored image upload with seamless dual-mode storage (Cloudinary buffer stream when configured, with high-quality Base64 Data URI fallback). 100% serverless compatible with Vercel serverless functions.
    - `DELETE /api/auth/profile/avatar`: One-click profile picture removal restoring default initials badge.
  - **Student Profile Experience (`StudentProfilePage.jsx`):**
    - Interactive DP / Avatar header with live upload, preview, and delete controls.
    - Personal Information card allowing students to update their contact number, department, and bio while preserving student ID and email integrity.
    - Security & Password change card with validation and confirmation.
    - Grievance resolution stats overview card showing real-time counts.
  - **Admin Enrolled Student Dossier (`AdminManageStudentsPage.jsx`):**
    - Removed all dummy/mock avatars.
    - Enrolled student table now renders real student profile avatars (or initials badge).
    - "Profile" button opens an enriched Student Profile Dossier modal showcasing student DP, Student ID, Email, WhatsApp/Phone, Department, Enrolled Date, Student Bio/Residence, and full grievance metrics breakdown.
  - **Navigation Integration (`DashboardLayout.jsx` & `App.jsx`):**
    - Added "My Profile" to student dashboard sidebar.
    - Made user profile chip in topbar and sidebar clickable for instant profile access.
    - Topbar and sidebar automatically reflect the student's custom avatar in real-time.

---

### [v2.1.1] — Enforce Verified-Only Student Directory & Dashboard Metrics
- **Tag:** `v2.1.1`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Enrolled Student Filter (`adminController.js`):** Updated `getStudentsList` to strictly query `{ role: 'student', isVerified: true }`, ensuring students still on the OTP verification screen are never listed as enrolled until their 6-digit code is successfully validated.
  - **Admin Dashboard KPI Alignment (`adminController.js`):** Updated `getAdminDashboard` total student counter to count only verified students (`{ role: 'student', isVerified: true }`).
  - **Directory Subtitle Polish (`AdminManageStudentsPage.jsx`):** Clarified directory counter to show verified enrolled students.

---

### [v2.1.0] — Mobile-First Architecture & Production Polish
- **Commit:** `bab7517` | **Tag:** `v2.1.0`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **iOS Safari Auto-Zoom Fix:** Enforced `font-size: 16px !important` on all mobile inputs, selects, and textareas (< 768px) to eliminate disruptive automatic zooming on iPhones and iPads.
  - **Horizontal Viewport Locking:** Bound `overflow-x: hidden` and dynamic viewport units (`100dvh`) across `html` and `body` to prevent horizontal page wobble.
  - **Mobile Navigation Drawer (`PublicNavbar.jsx`):** Rebuilt mobile menu drawer with smooth micro-animations, adding direct routes for Home, How It Works, Campus Facilities, Terms & Conditions, Student Login, Registration, and Admin Terminal.
  - **Compact Dashboard Shell (`DashboardLayout.jsx`):** Added auto-closing mobile sidebar on route transitions, streamlined topbar with compact search trigger, and initials avatar badge.
  - **Touch-Optimized Data Tables (`index.css`):** Wrapped all tables in `-webkit-overflow-scrolling: touch` containers with `min-width: 620px` to protect columns from vertical squishing on narrow screens.
  - **Responsive Form Grids (`SubmitComplaintPage.jsx`):** Converted 2-column form rows (`.form-grid-2col`) and 4-column priority pickers (`.priority-picker-grid`) into responsive thumb-friendly mobile stacks.
  - **Database Cleanup:** Purged all dummy test accounts (`@campuscare.edu`) and test tickets from MongoDB Atlas. Provisioned second verified admin (`personal44577@gmail.com`).

---

### [v2.0.0] — Security Hardening, Serverless Compatibility & UI Overhaul
- **Commit:** `c97d802` | **Tag:** `v2.0.0`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - **Credential Purge:** Removed all plaintext credentials from code, seed scripts, and documentation; strictly read from `process.env`.
  - **Registration Squatting Defense:** Allowed unverified records to be cleanly overwritten on new registration attempts with fresh OTPs; added 30-minute MongoDB TTL auto-cleanup (`unverifiedExpiresAt`).
  - **Anti-Brute-Force OTP Lockout:** Stored SHA-256 hashed OTPs in MongoDB; tracked `otpAttempts` and locked out verification after 5 failed guesses.
  - **Serverless Cloudinary File Uploads:** Replaced local disk writes with `multer.memoryStorage()` streaming to Cloudinary via HTTPS, resolving Vercel read-only filesystem (`EROFS`) limitations.
  - **Project Team Credits:** Added dedicated "Developed By" section on homepage and footer for Zain Shah (2665), M. Salman (2652), and M. Furqan (2692).
  - **Unified Categories:** Centralized facility categories into `client/src/constants/categories.js`.
  - **UX Polish:** Added dynamic document titles, skeleton shimmer loaders, and accessible empty states.

---

### [v1.2.0] — Production Email Delivery Engine
- **Commit:** `d208df3` | **Tag:** `v1.2.0`
- **Release Date:** November 24, 2026
- **Changes & Enhancements:**
  - Integrated production Nodemailer transport backed by Gmail SMTP with connection pooling for serverless execution.
  - Strictly `await`ed email delivery in all authentication and grievance dispatch controllers before returning HTTP responses.
  - Added Resend API and simulated console fallbacks for resilient email dispatch.

---

### [v1.1.0] — Multi-Screen Registration & OTP Verification
- **Commit:** `0a8dbb8` | **Tag:** `v1.1.0`
- **Release Date:** November 23, 2026
- **Changes & Enhancements:**
  - Split student registration into a clean 2-screen flow: Registration Form $\rightarrow$ Dedicated OTP Verification Screen with 60-second countdown timer.
  - Added standalone Terms & Conditions page (`/terms`) with canonical redirect from `/terms-and-conditions`.
  - Implemented dual-channel recovery selector on Forgot Password screen.

---

### [v1.0.0] — Initial Core MERN System
- **Commit:** `7fa208d` | **Tag:** `v1.0.0`
- **Release Date:** November 23, 2026
- **Changes & Enhancements:**
  - Initial end-to-end MERN architecture (React + Vite, Node.js + Express, MongoDB Atlas).
  - Student complaint lodging with photo attachments, status tracking, and priority SLA flags.
  - Administrative cockpit with weekly resolution velocity charts and status triage controls.
  - Obsidian (`#09090b`) & Precision Slate design system.

---

## 🔄 How to Roll Back to a Previous Version

If you ever need to roll back the website to a prior version, you have three simple methods:

### Method 1: Instant 1-Click Rollback in Vercel (Fastest & Safest)
*No code editing or Git terminal commands required.*
1. Go to your **[Vercel Dashboard](https://vercel.com/)** and select the **CampusCare** project.
2. Click on the **Deployments** tab.
3. Locate the deployment associated with the version you want (e.g., `v2.0.0` or `v1.2.0`).
4. Click the three dots (`...`) on that deployment and select **Promote to Production** (or **Rollback**).
5. Vercel will instantly switch live production traffic to that version in **less than 5 seconds** with zero downtime.

---

### Method 2: Git Rollback via Local Terminal
To roll back your local codebase and deploy it to GitHub:

#### To view or test a prior version locally:
```bash
# Switch to v2.0.0 to inspect or test
git checkout v2.0.0

# Return back to the latest version
git checkout main
```

#### To permanently roll back `main` to a previous version:
```bash
# Example: Reset main back to v2.0.0
git checkout main
git reset --hard v2.0.0

# Force-push to GitHub to trigger automatic Vercel redeployment
git push origin main --force
```

#### To cleanly revert without rewriting Git history:
```bash
# Creates a new commit that reverts changes back to a target state
git revert --no-commit <commit-hash>..HEAD
git commit -m "chore: rollback to v2.0.0"
git push origin main
```

---

### Method 3: Rollback by Downloading GitHub Release ZIP
1. Open your repository on GitHub: `https://github.com/zainshahg0005-ui/CampusCare`
2. Click on **Tags** or **Releases**.
3. Select any release tag (e.g., `v2.0.0`, `v1.2.0`, `v1.0.0`).
4. Download the complete source code snapshot (`.zip`).
