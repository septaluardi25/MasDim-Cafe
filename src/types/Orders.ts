export interface OrderPayload {
  customerName: string;
  tableNumber: number;
  cart: Cart[];
}

export interface Cart {
  menuItemId: string;
  quantity: number;
  notes: string;
}

export interface OrderResponse {
  id: string;
  customer_name: string;
  table_number: number;
  cart: Cart[];
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
}
