'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateMeal } from '@/data/meals';

export type UpdateMealActionInput = {
  id: string;
  name: string;
  date: string;
};

export async function updateMealAction(values: UpdateMealActionInput): Promise<void> {
  const { userId } = await auth.protect();

  await updateMeal(
    values.id,
    { name: values.name, date: new Date(values.date) },
    userId,
  );

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
