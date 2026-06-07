# Med-Share Africa

**Med-Share Africa** is a premium, highly secure clinical intelligence network and medical directory. Designed for the elite echelon of African healthcare professionals, the platform facilitates the encrypted exchange of vetted medical knowledge, clinical journals, and peer-to-peer insights.

> **Status:** Production Ready. The platform operates on a high-availability infrastructure serving verified practitioners across 24 countries.

---

## The Standard of Care

We have moved away from the conventional "tech dashboard" aesthetic to embrace a **Pure Luxury Health & Wellness** experience. The environment is styled in Obsidian Black, Deep Emerald Green, and Warm Champagne Gold—evoking the prestige, calm, and authority of an exclusive private clinic.

- **Rigorous Verification:** Every article, journal entry, and health tip is strictly vetted.
- **Confidentiality First:** Fully encrypted and anonymized clinical forums protect patient privacy.
- **Elite Directory:** Gain unparalleled access to a continent-wide network of distinguished healthcare providers.

## Clinical Infrastructure

- **Framework:** Next.js 16.2 (App Router, Turbopack)
- **Authentication:** NextAuth (v5 Beta) - Secure OAuth & Credentialing
- **Database Architecture:** Firebase Cloud Firestore (Real-time NoSQL)
- **UI & Aesthetic Engine:** Tailwind CSS v4 + Custom Glassmorphism System
- **Componentry:** Material-UI (MUI) & React Icons

---

## Directory Navigation

The portal is restricted to authorized users. Key clinical areas include:

- **`/` (The Portal):** The secure entryway and intelligence preview.
- **`/tips` (Clinical Journal):** The centralized repository of verified medical records.
- **`/upload` (Publishing Hub):** The Formik-validated terminal for submitting new medical findings to the board.
- **`/profile` (Credentials):** The secure hub for managing your authorized identity and revoking past records.

---

## Local Deployment

To run a local instance of the Med-Share Africa network for development or security auditing:

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure your environment variables in a `.env.local` file:
   ```env
   AUTH_SECRET="your-secure-secret"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   ```

3. Initialize the clinical server:
   ```bash
   npm run dev
   ```

Visit the local portal to verify aesthetic and functional integrity.

---

*Med-Share Africa. Clinical Excellence Guaranteed.*
