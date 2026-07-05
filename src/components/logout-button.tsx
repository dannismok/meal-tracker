'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const { signOut } = useClerk();

  return (
    <Button variant="ghost" size="icon" onClick={() => signOut({ redirectUrl: '/' })} aria-label="Sign out">
      <LogOut className="size-4" />
    </Button>
  );
}
