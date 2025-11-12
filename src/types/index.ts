export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  memberSince: string;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}
