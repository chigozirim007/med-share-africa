import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"

const getFirebasePrivateKey = () => {
  const key = process.env.AUTH_FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;
  
  // Strip any wrapping double quotes that Vercel or other hosts might add
  let cleaned = key.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }
  
  // Replace escaped newlines with actual newlines
  return cleaned.replace(/\\n/g, "\n");
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  adapter: process.env.AUTH_FIREBASE_PROJECT_ID ? FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: getFirebasePrivateKey(),
    }),
  }) : undefined,
});
