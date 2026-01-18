
import { Theme, Level } from './types';

export const LEVELS: Level[] = [
  { id: 'l1', name: '入门级', rows: 6, cols: 4, time: 120, uniqueTiles: 8, },
  { id: 'l2', name: '进阶级', rows: 8, cols: 6, time: 180, uniqueTiles: 12, },
  { id: 'l3', name: '大师级', rows: 10, cols: 6, time: 240, uniqueTiles: 16, },
  { id: 'l4', name: '禅定级', rows: 12, cols: 8, time: 300, uniqueTiles: 24, },
];

export const THEMES: Theme[] = [
  // {
  //   id: 't1',
  //   name: '热带雨林',
  //   type: 'image',
  //   items: [
  //     'https://images.unsplash.com/photo-1518173959113-34755a036bd1?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1520114878144-6123444a6863?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1433086566789-029737579f1c?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=128&h=128&fit=crop',
  //   ],
  //   bgColor: 'bg-emerald-50',
  //   accentColor: 'emerald'
  // },
  {
    id: 't2',
    name: '精致萌宠',
    type: 'emoji',
    items: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐴', '🐑', '🐘', '🐧', '🦆', '🦉', '🦇', '🐺'],
    bgColor: 'bg-indigo-50',
    accentColor: 'indigo'
  },
  {
    id: 't4',
    name: '禅意植物',
    type: 'emoji',
    items: ['🌿', '🌵', '🌴', '🌳', '🌲', '🌱', '🍃', '🍂', '🍁', '🍀', '🎋', '🎍', '🌸', '🌼', '🌻', '🌞', '🌙', '⭐', '☁️', '🌊', '🏔️', '🌋', '🏜️', '🏝️'],
    bgColor: 'bg-slate-50',
    accentColor: 'slate'
  },
  // {
  //   id: 't3',
  //   name: '深夜食堂',
  //   type: 'image',
  //   items: [
  //     'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=128&h=128&fit=crop',
  //     'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=128&h=128&fit=crop',
  //   ],
  //   bgColor: 'bg-rose-50',
  //   accentColor: 'rose'
  // }
];

export const INITIAL_HINTS = 10;
export const INITIAL_SHUFFLES = 3;
