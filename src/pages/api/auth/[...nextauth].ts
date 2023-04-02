import jwt from "jsonwebtoken"
import NextAuth, { DefaultSession, NextAuthOptions, Session, User } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

declare module "next-auth" {
  interface Session {
    supabaseAccessToken?: string
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_KEY,
  }),
  callbacks: {
    session: async ({
      session,
      user,
    }: {
      session: Session
      user: User | AdapterUser
    }) => {
      const signingSecret = process.env.SUPABASE_JWT_SECRET
      const payload = {
        aud: "authenticated",
        exp: Math.floor(new Date(session.expires).getTime() / 1000),
        sub: user.id,
        email: user.email,
        role: "authenticated",
      }
      session.user.id = user.id
      session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      return session
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
}

export default NextAuth(authOptions)
