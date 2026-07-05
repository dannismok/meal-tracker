import { auth } from '@clerk/nextjs/server';
import { getMealsByUser } from '@/data/meals';
import { DashboardClient } from './dashboard-client';
import { deleteMealAction } from './actions';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth.protect();
  const params = await searchParams;
  const selectedDate = params.date ? new Date(params.date) : new Date();
  const meals = await getMealsByUser(userId, selectedDate);

  return (
    <DashboardClient
      meals={meals}
      selectedDate={selectedDate}
      deleteMealAction={deleteMealAction}
    />
  );
}
