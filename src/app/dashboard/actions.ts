'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { deleteMeal } from '@/data/meals';

export type DeleteMealActionInput = {
  id: string;
};

export async function deleteMealAction(values: DeleteMealActionInput): Promise<void> {
  const { userId } = await auth.protect();

  await deleteMeal(values.id, userId);

  revalidatePath('/dashboard');
}
