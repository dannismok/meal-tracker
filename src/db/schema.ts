import { integer, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const meals = pgTable('meals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const foodItems = pgTable('food_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  calories: integer('calories').notNull(),
  userId: text('user_id'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const mealFoods = pgTable('meal_foods', {
  id: uuid('id').defaultRandom().primaryKey(),
  mealId: uuid('meal_id')
    .notNull()
    .references(() => meals.id, { onDelete: 'cascade' }),
  foodItemId: uuid('food_item_id')
    .notNull()
    .references(() => foodItems.id, { onDelete: 'cascade' }),
  servings: numeric('servings').notNull().default('1'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const mealsRelations = relations(meals, ({ many }) => ({
  mealFoods: many(mealFoods),
}));

export const foodItemsRelations = relations(foodItems, ({ many }) => ({
  mealFoods: many(mealFoods),
}));

export const mealFoodsRelations = relations(mealFoods, ({ one }) => ({
  meal: one(meals, {
    fields: [mealFoods.mealId],
    references: [meals.id],
  }),
  foodItem: one(foodItems, {
    fields: [mealFoods.foodItemId],
    references: [foodItems.id],
  }),
}));
