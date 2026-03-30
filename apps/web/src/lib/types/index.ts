export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number; // stored in cents
  imageUrl: string;
  stock: number;
  createdAt: Date;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IOrder {
  id: string;
  stripeSessionId: string;
  totalAmount: number; // in cents
  status: "pending" | "paid" | "failed";
  createdAt: Date;
  items: IOrderItem[];
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number; // in cents
}
