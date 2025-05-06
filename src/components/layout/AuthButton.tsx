'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';

export default function AuthButton() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/profile" className="text-sm font-medium hover:text-primary">
          My Profile
        </Link>
        <button
          onClick={handleSignOut}
          className="text-sm font-medium hover:text-primary"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login" className="text-sm font-medium hover:text-primary">
        Sign In
      </Link>
      <Link href="/signup" className="btn btn-primary">
        Sign Up
      </Link>
    </div>
  );
}
