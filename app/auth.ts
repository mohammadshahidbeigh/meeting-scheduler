import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { DefaultSession } from "next-auth"

// Extend the built-in session type
interface ExtendedSession extends DefaultSession {
  user: {
    id?: string
  } & DefaultSession["user"]
}

export const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/error'
  },
  callbacks: {
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        },
        expires: session.expires // This is included in DefaultSession
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}) 