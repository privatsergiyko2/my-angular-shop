import {CartItem} from './cart-item';

export interface Order {
  name: string;
  _id: number;
  items: CartItem[];
  total: number;
}
