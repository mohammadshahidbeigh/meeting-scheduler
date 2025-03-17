'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-4">
          {error || 'An error occurred during authentication'}
        </p>
        <Link
          href="/login"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
} 