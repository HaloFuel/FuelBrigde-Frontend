import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';

import { OrderingStore } from './ordering.store';
import { OrderingApi } from '../infrastructure/ordering-api';
import { Order } from '../domain/model/order.entity';

describe('OrderingStore - Sprint 1 US-12', () => {

  let store: OrderingStore;
  let ordersSubject: BehaviorSubject<Order[]>;

  beforeEach(() => {
    ordersSubject = new BehaviorSubject<Order[]>([]);

    TestBed.configureTestingModule({
      providers: [
        OrderingStore,
        {
          provide: OrderingApi,
          useValue: {
            getRequests: () => of([]),
            getOrders: () => ordersSubject.asObservable()
          }
        }
      ]
    });

    store = TestBed.inject(OrderingStore);
  });

  /**
   * Sprint 1 - US-12
   * Verifies the counter when no orders exist.
   */
  it('should return zero when there are no orders', () => {
    expect(store.dispatchedOrderCount()).toBe(0);
  });

  /**
   * Sprint 1 - US-12
   * Verifies that only dispatched orders are counted.
   */
  it('should count only dispatched orders', () => {

    ordersSubject.next([
      createOrder('1', 'CREATED'),
      createOrder('2', 'DISPATCHED'),
      createOrder('3', 'DISPATCHED'),
      createOrder('4', 'DELIVERED')
    ]);

    expect(store.dispatchedOrderCount()).toBe(2);
  });

  /**
   * Sprint 1 - US-12
   * Verifies that the counter updates when order data changes.
   */
  it('should update the counter when orders change', () => {

    ordersSubject.next([
      createOrder('1', 'DISPATCHED')
    ]);

    expect(store.dispatchedOrderCount()).toBe(1);

    ordersSubject.next([
      createOrder('1', 'DISPATCHED'),
      createOrder('2', 'DISPATCHED'),
      createOrder('3', 'CREATED')
    ]);

    expect(store.dispatchedOrderCount()).toBe(2);
  });

  // Helper method to create test orders
  function createOrder(id: string, status: string): Order {
    return new Order({
      id: id,
      requestId: 'REQ-001',
      clientId: 'CLIENT-001',
      providerId: 'PROVIDER-001',
      productId: 'PRODUCT-001',
      quantity: 100,
      unit: 'L',
      totalAmount: 500,
      deliveryAddress: 'Lima, Peru',
      status: status,
      dispatchedAt: null,
      deliveredAt: null,
      closedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

});
