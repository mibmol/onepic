import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

declare module "next-auth" {
  interface Session {
    supabaseAccessToken?: string
    user: {
      id: string
      name: string
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
    session: async ({ session, user }) => {
      session.user.id = user.id
      return session as any
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
