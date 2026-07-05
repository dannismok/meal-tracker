'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UpdateMealActionInput } from './actions';

type MealData = {
  id: string;
  name: string;
  date: Date;
};

export function EditMealForm({
  meal,
  updateMealAction,
}: {
  meal: MealData;
  updateMealAction: (values: UpdateMealActionInput) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await updateMealAction({
      id: meal.id,
      name: formData.get('name') as string,
      date: formData.get('date') as string,
    });
  }

  return (
    <form action={handleSubmit} className="mx-auto max-w-md space-y-6 p-6">
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
  );
}
