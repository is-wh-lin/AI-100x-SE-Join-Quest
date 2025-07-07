import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'expect';
import { OrderService } from '../../src/OrderService';
import { Order } from '../../src/Order';
import { OrderItem } from '../../src/OrderItem';
import { Product } from '../../src/Product';
import { ThresholdDiscount } from '../../src/discount/ThresholdDiscount';
import { BuyOneGetOneDiscount } from '../../src/discount/BuyOneGetOneDiscount';

interface CustomWorld {
  orderService: OrderService;
  order: Order;
  products: Product[];
  discounts: any[];
}

declare module '@cucumber/cucumber' {
  interface World extends CustomWorld {}
}

Before(function (this: CustomWorld) {
  this.discounts = [];
  this.orderService = new OrderService(this.discounts);
});

Given('no promotions are applied', function (this: CustomWorld) {
  // Handled by Before hook
});

Given('the threshold discount promotion is configured:', function (this: CustomWorld, dataTable) {
  const promotion = dataTable.hashes()[0];
  const discount = new ThresholdDiscount(parseInt(promotion.threshold), parseInt(promotion.discount));
  this.discounts.push(discount);
  this.orderService = new OrderService(this.discounts);
});

Given('the buy one get one promotion for cosmetics is active', function (this: CustomWorld) {
  const discount = new BuyOneGetOneDiscount('cosmetics');
  this.discounts.push(discount);
  this.orderService = new OrderService(this.discounts);
});

When('a customer places an order with:', function (this: CustomWorld, dataTable) {
  const rows = dataTable.hashes();
  this.products = rows.map((row: any) => new Product(row.productId || row.productName, row.productName, parseInt(row.unitPrice), row.category || ''));
  const orderItems = rows.map((row: any) => {
    const product = this.products.find(p => p.productName === row.productName);
    return new OrderItem(product!, parseInt(row.quantity));
  });
  this.order = this.orderService.checkout(orderItems);
});

Then('the order summary should be:', function (this: CustomWorld, dataTable) {
  const expected = dataTable.hashes()[0];
  if (expected.originalAmount) {
    expect(this.order.originalAmount).toBe(parseInt(expected.originalAmount));
  }
  if (expected.discount) {
    expect(this.order.discount).toBe(parseInt(expected.discount));
  }
  expect(this.order.totalAmount).toBe(parseInt(expected.totalAmount));
});

Then('the customer should receive:', function (this: CustomWorld, dataTable) {
  const expectedItems = dataTable.hashes();
  for (const expectedItem of expectedItems) {
    const actualItem = this.order.items.find(item => item.product.productName === expectedItem.productName);
    expect(actualItem).toBeDefined();
    expect(actualItem!.quantity).toBe(parseInt(expectedItem.quantity));
  }
});