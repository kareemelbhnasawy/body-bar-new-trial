import { Utensils, Dumbbell, Shirt, Zap, Bike } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Category {
  /** User-facing display name */
  label: string;
  /** Short label for mobile nav / strips */
  shortLabel: string;
  /** Route path (unchanged from original) */
  path: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Accent color for category chips */
  color: string;
  /** Supabase / useProducts filter key */
  filterKey: string;
  /** One-line description */
  desc: string;
  /** Category image (existing public assets) */
  img: string;
}

/** Canonical category order — Meals → Personal Training → Sportswear → Supplements → Equipment */
export const CATEGORIES: Category[] = [
  {
    label:      'Meals',
    shortLabel: 'Meals',
    path:       '/diet-food',
    icon:       Utensils,
    color:      '#22C55E',
    filterKey:  'diet-food',
    desc:       'Chef-crafted meal plans delivered.',
    img:        '/images/category_diet_food_1771074226839.png',
  },
  {
    label:      'Personal Training',
    shortLabel: 'Training',
    path:       '/coaching',
    icon:       Dumbbell,
    color:      '#F55A1A',
    filterKey:  'coaching',
    desc:       'Certified coaches, real results.',
    img:        '/images/category_coaching_1771074301340.png',
  },
  {
    label:      'Sportswear',
    shortLabel: 'Sportswear',
    path:       '/gym-wear',
    icon:       Shirt,
    color:      '#A78BFA',
    filterKey:  'gym-wear',
    desc:       'Performance apparel for every move.',
    img:        '/images/category_gym_wear_1771074258065.png',
  },
  {
    label:      'Supplements',
    shortLabel: 'Supps',
    path:       '/supplements',
    icon:       Zap,
    color:      '#FBBF24',
    filterKey:  'supplements',
    desc:       'Fuel your performance.',
    img:        '/images/category_supplements_1771074241033.png',
  },
  {
    label:      'Equipment',
    shortLabel: 'Equipment',
    path:       '/equipment',
    icon:       Bike,
    color:      '#60A5FA',
    filterKey:  'equipment',
    desc:       'Machines & home gym gear.',
    img:        '/images/category_equipment_1771074286353.png',
  },
];
