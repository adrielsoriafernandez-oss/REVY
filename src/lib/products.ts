import data from '../data/products.json';
import type { Product } from '../types/product';
export const products = data as Product[];
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
export const money = (value: number | null) =>
  value === null
    ? 'Consultar precio'
    : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export const categories = [...new Set(products.map((p) => p.category))].sort((a, b) =>
  a.localeCompare(b, 'es'),
);
