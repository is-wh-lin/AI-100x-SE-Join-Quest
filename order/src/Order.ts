import { OrderItem } from "./OrderItem";

export class Order {
    public totalAmount: number = 0;
    public originalAmount: number = 0;
    public discount: number = 0;
    public items: OrderItem[] = [];
}