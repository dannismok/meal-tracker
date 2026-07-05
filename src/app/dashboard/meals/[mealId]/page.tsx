import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getMealById } from '@/data/meals';
import { updateMealAction, addFoodItemAction, removeFoodItemAction, deleteMealAction } from './actions';
import { EditMealForm } from './edit-meal-form';

export default async function EditMealPage({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) {
  const { mealId } = await params;
  const { userId } = await auth.protect();
  const meal = await getMealById(mealId, userId);

  if (!meal) {
    notFound();
  }

  return (
    <EditMealForm
      meal={meal}
      updateMealAction={updateMealAction}
      addFoodItemAction={addFoodItemAction}
      removeFoodItemAction={removeFoodItemAction}
      deleteMealAction={deleteMealAction}
    />
  );
}
