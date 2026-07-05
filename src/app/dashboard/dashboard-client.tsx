'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { MealWithFoodItems } from '@/data/meals';
import type { DeleteMealActionInput } from './actions';

function totalCalories(items: { calories: number; servings: string }[]): number {
  return items.reduce((sum, f) => sum + f.calories * Number(f.servings), 0);
}

export function DashboardClient({
  meals,
  selectedDate,
  deleteMealAction,
}: {
  meals: MealWithFoodItems[];
  selectedDate: Date;
  deleteMealAction: (values: DeleteMealActionInput) => Promise<void>;
}) {
  const router = useRouter();
  const [date, setDate] = useState<Date>(selectedDate);
  const [deletePending, setDeletePending] = useState<string | null>(null);

  const handleDateChange = (d: Date | undefined) => {
    if (!d) return;
    setDate(d);
    router.push(`/dashboard?date=${format(d, 'yyyy-MM-dd')}`);
  };

  async function handleDeleteMeal(mealId: string) {
    if (!window.confirm('Are you sure you want to delete this meal? This action cannot be undone.')) {
      return;
    }
    setDeletePending(mealId);
    await deleteMealAction({ id: mealId });
  }

  const total = meals.reduce((sum, m) => sum + totalCalories(m.foodItems), 0);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" className="w-fit">
                <CalendarIcon />
                {format(date, 'PPP')}
              </Button>
            }
          />
          <PopoverContent align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => router.push('/dashboard/meals/new')}>
          <Plus />
          Log new meal
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Total calories: {total.toFixed(0)}
        </p>
        {meals.length === 0 && (
          <p className="text-sm text-muted-foreground">No meals for this day.</p>
        )}
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{meal.name}</h2>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  {format(meal.date, 'p')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/dashboard/meals/${meal.id}`)}
                  aria-label={`Edit ${meal.name}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deletePending === meal.id}
                  onClick={() => handleDeleteMeal(meal.id)}
                  aria-label={`Delete ${meal.name}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
            <ul className="space-y-1">
              {meal.foodItems.map((food) => (
                <li
                  key={food.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {food.name} x{food.servings}
                  </span>
                  <span className="text-muted-foreground">
                    {(food.calories * Number(food.servings)).toFixed(0)} cal
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 border-t pt-2 text-sm font-medium">
              Meal total: {totalCalories(meal.foodItems).toFixed(0)} cal
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
