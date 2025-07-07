import { Order } from '../Order';

const DISCOUNT_RATE_DOUBLE_11 = 0.2;

export class Double11Discount {
  private enabled: boolean;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  apply(order: Order): void {
    if (!this.enabled) {
      return;
    }

    // Group items by product ID
    const productGroups = new Map<string, { unitPrice: number; totalQuantity: number }>();

    for (const item of order.items) {
      const productId = item.product.id; // Using id for product identification
      if (productGroups.has(productId)) {
        const group = productGroups.get(productId)!;
        group.totalQuantity += item.quantity;
      } else {
        productGroups.set(productId, {
          unitPrice: item.product.unitPrice,
          totalQuantity: item.quantity,
        });
      }
    }

    let totalDiscount = 0;

    // Calculate discount for each product group
    for (const [productId, group] of productGroups) {
      const discountedItems = Math.floor(group.totalQuantity / 10) * 10;
      const discountAmount = discountedItems * group.unitPrice * DISCOUNT_RATE_DOUBLE_11;
      totalDiscount += discountAmount;
    }

    order.discount += totalDiscount;
    order.totalAmount = order.originalAmount - order.discount;
  }
}
