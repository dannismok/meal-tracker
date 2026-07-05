'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateMeal, addFoodToMeal, removeFoodFromMeal, deleteMeal } from '@/data/meals';

export type UpdateMealActionInput = {
  id: string;
  name: string;
  date: string;
};

export type AddFoodItemActionInput = {
  mealId: string;
  name: string;
  calories: number;
  servings: string;
};

export type RemoveFoodItemActionInput = {
  mealId: string;
  mealFoodId: string;
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

export async function addFoodItemAction(values: AddFoodItemActionInput): Promise<void> {
  const { userId } = await auth.protect();

  await addFoodToMeal(
    values.mealId,
    { name: values.name, calories: values.calories, servings: values.servings },
    userId,
  );

  revalidatePath(`/dashboard/meals/${values.mealId}`);
}

export async function removeFoodItemAction(values: RemoveFoodItemActionInput): Promise<void> {
  const { userId } = await auth.protect();

  await removeFoodFromMeal(values.mealFoodId, values.mealId, userId);

  revalidatePath(`/dashboard/meals/${values.mealId}`);
}

export type DeleteMealActionInput = {
  id: string;
};

export async function deleteMealAction(values: DeleteMealActionInput): Promise<void> {
  const { userId } = await auth.protect();

  await deleteMeal(values.id, userId);

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
