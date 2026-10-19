import {CartItem} from './cart-item';

export interface Order {
  name: string;
  id: number;
  items: CartItem[];
  total: number;
}
