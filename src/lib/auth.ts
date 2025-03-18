import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials')
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET')
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log('JWT Callback:', { token, account })
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }): Promise<Session> {
      console.log('Session Callback:', { session, token })
      if (session.user) {
        session.user.accessToken = token.accessToken
        session.user.id = token.sub ?? ''
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect Callback:', { url, baseUrl })
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn Callback:', { user, account, profile, email, credentials })
      return true
    }
  },
  pages: {
    signIn: '/login',
    error: '/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
})

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
} 