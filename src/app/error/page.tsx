'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-3">Authentication Error</h1>
      <p className="text-sm text-gray-600 mb-3">
        {error || 'An error occurred during authentication'}
      </p>
      <Link
        href="/login"
        className="text-blue-500 hover:text-blue-700 underline text-sm"
      >
        Back to Login
      </Link>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-3">Loading...</h1>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
} 