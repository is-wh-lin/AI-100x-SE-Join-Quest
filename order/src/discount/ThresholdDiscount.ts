import { Order } from "../Order";

export class ThresholdDiscount {
    constructor(private threshold: number, private discount: number) {}

    apply(order: Order): void {
        if (order.originalAmount >= this.threshold) {
            order.discount = this.discount;
            order.totalAmount = order.originalAmount - order.discount;
        }
    }
}