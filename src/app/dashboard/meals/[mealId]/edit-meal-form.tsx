'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
  UpdateMealActionInput,
  AddFoodItemActionInput,
  RemoveFoodItemActionInput,
  DeleteMealActionInput,
} from './actions';

type FoodItem = {
  id: string;
  mealFoodId: string;
  name: string;
  calories: number;
  servings: string;
};

type MealData = {
  id: string;
  name: string;
  date: Date;
  foodItems: FoodItem[];
};

function totalCalories(items: FoodItem[]): number {
  return items.reduce((sum, f) => sum + f.calories * Number(f.servings), 0);
}

export function EditMealForm({
  meal,
  updateMealAction,
  addFoodItemAction,
  removeFoodItemAction,
  deleteMealAction,
}: {
  meal: MealData;
  updateMealAction: (values: UpdateMealActionInput) => Promise<void>;
  addFoodItemAction: (values: AddFoodItemActionInput) => Promise<void>;
  removeFoodItemAction: (values: RemoveFoodItemActionInput) => Promise<void>;
  deleteMealAction: (values: DeleteMealActionInput) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [addPending, setAddPending] = useState(false);
  const [removePending, setRemovePending] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const addFormRef = useRef<HTMLFormElement>(null);

  async function handleUpdateSubmit(formData: FormData) {
    setPending(true);
    await updateMealAction({
      id: meal.id,
      name: formData.get('name') as string,
      date: formData.get('date') as string,
    });
  }

  async function handleAddFoodItem(formData: FormData) {
    setAddPending(true);
    await addFoodItemAction({
      mealId: meal.id,
      name: formData.get('food-name') as string,
      calories: Number(formData.get('calories')),
      servings: formData.get('servings') as string,
    });
    addFormRef.current?.reset();
    setAddPending(false);
  }

  async function handleRemoveFoodItem(mealFoodId: string) {
    setRemovePending(mealFoodId);
    await removeFoodItemAction({ mealId: meal.id, mealFoodId });
  }

  async function handleDeleteMeal() {
    if (!window.confirm('Are you sure you want to delete this meal? This action cannot be undone.')) {
      return;
    }
    setDeletePending(true);
    await deleteMealAction({ id: meal.id });
  }

  return (
    <div className="mx-auto max-w-md space-y-8 p-6">
      <form action={handleUpdateSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Meal</h1>

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Meal name
          </label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Breakfast"
            defaultValue={meal.name}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={format(meal.date, 'yyyy-MM-dd')}
            required
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Update meal'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
        </div>
      </form>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Food Items</h2>
          <span className="text-sm text-muted-foreground">
            Total: {totalCalories(meal.foodItems).toFixed(0)} cal
          </span>
        </div>

        {meal.foodItems.length === 0 && (
          <p className="text-sm text-muted-foreground">No food items added yet.</p>
        )}

        <ul className="space-y-2">
          {meal.foodItems.map((food) => (
            <li
              key={food.mealFoodId}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{food.name}</p>
                <p className="text-xs text-muted-foreground">
                  {food.calories} cal × {food.servings} serving
                  {Number(food.servings) !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {(food.calories * Number(food.servings)).toFixed(0)} cal
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={removePending === food.mealFoodId}
                  onClick={() => handleRemoveFoodItem(food.mealFoodId)}
                  aria-label={`Remove ${food.name}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">Add Food Item</h2>
        <form
          ref={addFormRef}
          action={handleAddFoodItem}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="food-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="food-name"
              name="food-name"
              placeholder="e.g. Chicken Breast"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="calories" className="text-sm font-medium">
                Calories
              </label>
              <Input
                id="calories"
                name="calories"
                type="number"
                min="0"
                placeholder="200"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="servings" className="text-sm font-medium">
                Servings
              </label>
              <Input
                id="servings"
                name="servings"
                type="number"
                min="0"
                step="0.5"
                defaultValue="1"
                placeholder="1"
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={addPending}>
            {addPending ? 'Adding…' : 'Add food item'}
          </Button>
        </form>
      </section>

      <section className="border-t pt-6">
        <Button
          variant="destructive"
          disabled={deletePending}
          onClick={handleDeleteMeal}
        >
          {deletePending ? 'Deleting…' : 'Delete meal'}
        </Button>
      </section>
    </div>
  );
}
