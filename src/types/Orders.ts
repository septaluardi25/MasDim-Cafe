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
