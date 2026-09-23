# Scholarship OS — Personal Scholarship CRM & Operating System

**Scholarship OS** is a private, production-ready scholarship application management system built for a gap-year student in Pakistan applying for international scholarships and university funding opportunities (e.g. MEXT, Turkiye Burslari, KAIST, DAAD, Commonwealth).

Designed with a calm, high-density, minimal aesthetic inspired by **Linear**, **Things**, and **Raycast**.

---

## Key Features

1. **Scholarship Deadline Timeline**:
   - Interactive horizontal desktop & vertical mobile timeline with a pulsing "TODAY" marker.
   - Filter by *This Month*, *3 Months*, *6 Months*, or *All Active*.
   - Instant visual identification of approaching deadlines, days remaining, and application status.

2. **Command Center Dashboard**:
   - Proactive **Needs Attention** alert engine: flags deadlines $\le 5$ days, overdue tasks, expiring documents, and missing recommendation letters.
   - **Workload Summary**: Real-time counters for *Today*, *This Week*, *This Month*, and *Overdue* tasks.
   - **Upcoming Deadlines**: Progress indicators showing completed requirements (e.g. *6/8 complete*).
   - **Today's Focus**: 1-click task completion widget with confetti celebration.

3. **To-Do & Workflow Engine**:
   - Filter views: *Today*, *This Week* (day-by-day Monday–Sunday execution grid), *This Month*, *Upcoming*, *Overdue*, and *All*.
   - Rapid rescheduling pills: `[Today]`, `[Tomorrow]`, `[Next Week]`.
   - Entity linking: Tasks connect directly to Scholarships, Documents, Requirements, and Activities.
   - 1-click task generation from scholarship requirements.

4. **Scholarships CRM & Pipeline**:
   - 9 Pipeline Stages: *Researching → Preparing → Ready to Apply → Applied → Interview → Waiting → Accepted / Rejected*.
   - Contextual workflows: "Ready to Apply" pre-flight checklist, "Interview" prep checklist, "Waiting" follow-up tracker.
   - Automatic application task scaffolding.

5. **Document Library & Firebase Cloud Storage**:
   - Centralized bank for passports, transcripts, recommendation letters, IELTS/SAT reports, and CVs.
   - Automated expiration date countdowns (&lt; 90 days warning).
   - Direct file upload to **Firebase Cloud Storage** with preview and download links.

6. **Activities & Achievements Database**:
   - Extracurriculars, leadership initiatives, competitions, olympiads, and research projects with quantifiable impact metrics and hours/week.

7. **Profile, Gap Year & Story Bank**:
   - Dedicated **Gap Year Workspace**: Structured justification of gap year, learnings, skills, and projects.
   - **Personal Story Bank**: Reusable essay building blocks with 1-click **Copy to Clipboard** for fast drafting.

8. **Global Tools**:
   - **Command Palette (`Ctrl + K` / `Cmd + K`)**: Instant search across all entities and quick actions.
   - **Quick Add Modal (`+`)**: Fast creation of tasks, scholarships, documents, or activities from anywhere.
   - **Full JSON Backup**: Export or restore your entire database with one click.

---

## Technology Stack

- **Frontend**: Next.js (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (Sleek dark mode palette, custom scrollbars, micro-interactions)
- **Icons**: Lucide React
- **Cloud Database**: Firebase Cloud Firestore (Real-time sync, always-on 100% free Spark tier)
- **Cloud File Storage**: Firebase Cloud Storage (5 GB free file hosting for PDFs, scans, and documents)
- **Offline / Local Fallback**: Instant LocalStorage persistence with rich seed data when offline.

---

## Quick Start (Local Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The app runs immediately with pre-loaded realistic seed data!

---

## Firebase Configuration (Cloud Firestore & Storage)

Scholarship OS runs out of the box in **Local Storage Mode**. To enable **multi-device synchronization** across your laptop and phone:

### Step 1: Create a free Firebase project
1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Enable **Cloud Firestore** in test mode (or allow read/write for your personal usage).
3. Enable **Cloud Storage** for documents.

### Step 2: Add Keys to `.env.local`
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

*(Alternatively, you can click **Cloud Sync** in the app's sidebar/header and paste your keys directly into the app!)*

---

## Deployment to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. In **Environment Variables**, paste the `NEXT_PUBLIC_FIREBASE_*` variables listed above.
5. Click **Deploy**.

Your scholarship portal will be live, fully persistent, and accessible from your phone, laptop, or tablet.
