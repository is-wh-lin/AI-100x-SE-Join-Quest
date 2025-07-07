import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { ThresholdDiscount } from "./discount/ThresholdDiscount";

export class OrderService {
    private discounts: any[] = [];

    constructor(discounts: any[] = []) {
        this.discounts = discounts;
    }

    checkout(items: OrderItem[]): Order {
        const order = new Order();
        order.items = items;
        order.originalAmount = items.reduce((acc, item) => acc + item.product.unitPrice * item.quantity, 0);
        order.totalAmount = order.originalAmount;
        order.discount = 0;

        for (const discount of this.discounts) {
            discount.apply(order);
        }

        return order;
    }
}