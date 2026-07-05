import { db } from '@/db';
import { meals } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export type CreateMealInput = {
  name: string;
  date: Date;
};

export type UpdateMealInput = {
  name: string;
  date: Date;
};

export type MealWithFoodItems = Awaited<ReturnType<typeof getMealsByUser>>[number];

export async function getMealsByUser(userId: string, date?: Date) {
  const conditions = [eq(meals.userId, userId)];
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    conditions.push(gte(meals.date, start), lte(meals.date, end));
  }
  const rows = await db.query.meals.findMany({
    where: and(...conditions),
    with: {
      mealFoods: {
        with: {
          foodItem: true,
        },
      },
    },
    orderBy: (meals, { asc }) => [asc(meals.date)],
  });

  return rows.map((meal) => ({
    id: meal.id,
    name: meal.name,
    date: meal.date,
    foodItems: meal.mealFoods.map((mf) => ({
      id: mf.foodItem.id,
      name: mf.foodItem.name,
      calories: mf.foodItem.calories,
      servings: mf.servings,
    })),
  }));
}

export async function createMeal(values: CreateMealInput, userId: string) {
  const [meal] = await db
    .insert(meals)
    .values({ ...values, userId })
    .returning();
  return meal;
}

export async function updateMeal(id: string, values: UpdateMealInput, userId: string) {
  const [meal] = await db
    .update(meals)
    .set({ ...values, updatedAt: new Date() })
    .where(and(eq(meals.id, id), eq(meals.userId, userId)))
    .returning();
  return meal;
}

export async function getMealById(id: string, userId: string) {
  const meal = await db.query.meals.findFirst({
    where: and(eq(meals.id, id), eq(meals.userId, userId)),
    with: {
      mealFoods: {
        with: {
          foodItem: true,
        },
      },
    },
  });
  if (!meal) return null;
  return {
    id: meal.id,
    name: meal.name,
    date: meal.date,
    foodItems: meal.mealFoods.map((mf) => ({
      id: mf.foodItem.id,
      name: mf.foodItem.name,
      calories: mf.foodItem.calories,
      servings: mf.servings,
    })),
  };
}
