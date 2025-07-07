@double11_discount
Feature: Double 11 Discount
  As a customer
  I want to enjoy a 20% discount for every 10 items of the same product during the Double 11 event
  So that I can buy in bulk at a better price

  Scenario: Buy 12 of the same product, 10 get 20% off, 2 at full price
    Given the Double 11 discount is enabled
    When the customer places an order with:
      | productId | productName | unitPrice | quantity |
      | S1        | Socks       | 100       | 12       |
    Then the total order price should be 1000

  Scenario: Buy 27 of the same product, 2 groups of 10 get 20% off, 7 at full price
    Given the Double 11 discount is enabled
    When the customer places an order with:
      | productId | productName | unitPrice | quantity |
      | S1        | Socks       | 100       | 27       |
    Then the total order price should be 2300

  Scenario: Buy 10 different products, 1 each, no discount
    Given the Double 11 discount is enabled
    When the customer places an order with:
      | productId | productName | unitPrice | quantity |
      | A         | ProductA    | 100       | 1        |
      | B         | ProductB    | 100       | 1        |
      | C         | ProductC    | 100       | 1        |
      | D         | ProductD    | 100       | 1        |
      | E         | ProductE    | 100       | 1        |
      | F         | ProductF    | 100       | 1        |
      | G         | ProductG    | 100       | 1        |
      | H         | ProductH    | 100       | 1        |
      | I         | ProductI    | 100       | 1        |
      | J         | ProductJ    | 100       | 1        |
    Then the total order price should be 1000

  Scenario: Discount not enabled, no discount applied
    Given the Double 11 discount is not enabled
    When the customer places an order with:
      | productId | productName | unitPrice | quantity |
      | S1        | Socks       | 100       | 12       |
    Then the total order price should be 1200