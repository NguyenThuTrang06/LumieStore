export type User = {
  id: number; name: string; email: string; phone?: string | null;
  address?: string | null; role: 'user' | 'admin';
};
export type Category = { id: number; name: string; description?: string | null };
export type Product = {
  id: number; category_id: number; category_name?: string; name: string;
  description: string; price: number; image: string; stock: number;
};
export type CartItem = Product & { quantity: number };
export type Order = {
  id: number; user_id: number; total: number; status: string;
  address: string; created_at: string; customer_name?: string;
};
