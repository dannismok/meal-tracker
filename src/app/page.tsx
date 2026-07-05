import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <span className="text-lg font-semibold">Meal Tracker</span>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Track your daily meals
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Log what you eat, track calories, and stay on top of your nutrition goals.
          </p>
          <SignInButton mode="modal">
            <Button size="lg">Get Started</Button>
          </SignInButton>
        </div>
      </main>
    </div>
  );
}
