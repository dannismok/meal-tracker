'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const placeholderMeals = [
  {
    id: '1',
    name: 'Breakfast',
    date: new Date(),
    foodItems: [
      { id: '1', name: 'Oatmeal', calories: 300, servings: '1' },
      { id: '2', name: 'Banana', calories: 105, servings: '1' },
      { id: '3', name: 'Milk', calories: 150, servings: '1' },
    ],
  },
  {
    id: '2',
    name: 'Lunch',
    date: new Date(),
    foodItems: [
      { id: '4', name: 'Chicken Sandwich', calories: 450, servings: '1' },
      { id: '5', name: 'Apple', calories: 95, servings: '1' },
    ],
  },
];

function totalCalories(
  items: { calories: number; servings: string }[],
): number {
  return items.reduce((sum, f) => sum + f.calories * Number(f.servings), 0);
}

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

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
            onSelect={(d) => d && setDate(d)}
          />
        </PopoverContent>
      </Popover>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Total calories:{' '}
          {placeholderMeals
            .reduce((sum, m) => sum + totalCalories(m.foodItems), 0)
            .toFixed(0)}
        </p>
        {placeholderMeals.map((meal) => (
          <div
            key={meal.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{meal.name}</h2>
              <span className="text-sm text-muted-foreground">
                {format(meal.date, 'p')}
              </span>
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
