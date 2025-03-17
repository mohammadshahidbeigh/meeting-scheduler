import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

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
    })
  ],
  pages: {
    signIn: '/login',
    error: '/error'
  },
  secret: process.env.NEXTAUTH_SECRET
}) 