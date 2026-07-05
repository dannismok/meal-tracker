import { createMealAction } from './actions';
import { NewMealForm } from './new-meal-form';

export default function NewMealPage() {
  return <NewMealForm createMealAction={createMealAction} />;
}
