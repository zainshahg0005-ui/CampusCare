# CampusCare — Version History & Release Registry

This document maintains an immutable audit trail of every major and minor release of **CampusCare**, including corresponding Git tags, commit hashes, feature additions, and instructions for rolling back to any previous state.

---

## 📌 Current Live Version: `v2.1.1` (Production Ready)
- **Git Tag:** `v2.1.1`
- **Release Date:** November 24, 2026
- **Status:** Active in Production ([Live Deployment](https://campuscare-livid.vercel.app/))
- **Key Focus:** Strict verified-only student enrollment filter (`isVerified: true`) on Admin Cockpit and Directory.

---

## 🗂️ Version Archive & Changelog

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
