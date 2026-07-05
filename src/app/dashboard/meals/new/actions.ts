'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createMeal } from '@/data/meals';

export type CreateMealActionInput = {
  name: string;
  date: string;
};

export async function createMealAction(values: CreateMealActionInput): Promise<void> {
  const { userId } = await auth.protect();

  await createMeal(
    {
      name: values.name,
      date: new Date(values.date),
    },
    userId,
  );

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
