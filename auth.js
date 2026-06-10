import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import bcrypt from "bcryptjs";

const getFirebasePrivateKey = () => {
  const key = process.env.AUTH_FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;
  let cleaned = key.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }
  return cleaned.replace(/\\n/g, "\n");
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Clinical Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Look up the user in Firestore by email
          const q = query(
            collection(db, "users"),
            where("email", "==", String(credentials.email).toLowerCase().trim())
          );
          const snapshot = await getDocs(q);

          if (snapshot.empty) return null;

          const userDoc = snapshot.docs[0];
          const user = userDoc.data();

          if (!user.passwordHash) return null;

          // Verify password against stored bcrypt hash
          const isValid = await bcrypt.compare(
            String(credentials.password),
            user.passwordHash
          );

          if (!isValid) return null;

          return {
            id: userDoc.id,
            name: user.name,
            email: user.email,
            image: user.image || null,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },

  adapter: process.env.AUTH_FIREBASE_PROJECT_ID
    ? FirestoreAdapter({
        credential: cert({
          projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
          clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
          privateKey: getFirebasePrivateKey(),
        }),
      })
    : undefined,
});
