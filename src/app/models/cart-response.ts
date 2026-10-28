export interface CartResponse {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}
