'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: false // Prevent automatic redirect to handle errors
      })
      
      if (result?.error) {
        console.error('Sign in error:', result.error)
        setError(`Authentication failed: ${result.error}`)
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Welcome to Meeting Scheduler
          </h2>
          <p className="mt-1.5 text-sm text-gray-600">
            Sign in with your Google account to continue 🔐
          </p>
        </div>
        
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent 
          text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:bg-blue-300 cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              Signing in...
            </div>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Sign in with Google
            </span>
          )}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
} 