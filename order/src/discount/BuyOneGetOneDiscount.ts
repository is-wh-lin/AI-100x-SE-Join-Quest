import { Order } from "../Order";
import { OrderItem } from "../OrderItem";

export class BuyOneGetOneDiscount {
    constructor(private category: string) {}

    apply(order: Order): void {
        for (const item of order.items) {
            if (item.product.category === this.category) {
                item.quantity += 1;
            }
        }
    }
}