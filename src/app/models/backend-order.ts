export interface BackendOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface BackendShippingAddress {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  region: string;
  postalCode: string;
}

export interface BackendOrder {
  _id: string;
  userId: string;
  items: BackendOrderItem[];
  shippingAddress: BackendShippingAddress;
  deliveryMethod: 'standard' | 'express' | 'pickup';
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}
