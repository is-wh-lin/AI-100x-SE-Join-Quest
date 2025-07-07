import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import { OrderService } from '../../src/OrderService';
import { Order } from '../../src/Order';
import { OrderItem } from '../../src/OrderItem';
import { Product } from '../../src/Product';
import { Double11Discount } from '../../src/discount/Double11Discount';

interface Double11World {
  orderService: OrderService;
  order: Order;
  double11Discount: Double11Discount;
}

declare module '@cucumber/cucumber' {
  interface World extends Double11World {}
}

Given('the Double 11 discount is enabled', function (this: Double11World) {
  this.double11Discount = new Double11Discount(true);
  this.orderService = new OrderService([this.double11Discount]);
});

Given('the Double 11 discount is not enabled', function (this: Double11World) {
  this.double11Discount = new Double11Discount(false);
  this.orderService = new OrderService([this.double11Discount]);
});

When('the customer places an order with:', function (this: Double11World, dataTable) {
  const rows = dataTable.hashes();
  const orderItems = rows.map((row: any) => {
    const product = new Product(row.productId, row.productName, parseInt(row.unitPrice), '');
    return new OrderItem(product, parseInt(row.quantity));
  });
  this.order = this.orderService.checkout(orderItems);
});

Then('the total order price should be {int}', function (this: Double11World, expectedTotal: number) {
  expect(this.order.totalAmount).toBe(expectedTotal);
});
