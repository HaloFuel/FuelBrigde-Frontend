import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderingStore } from '../../../application/ordering.store';
import { Order } from '../../../domain/model/order.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe, DecimalPipe } from '@angular/common';

/**
 * OrderDetail - Order Detail View (US-06)
 *
 * Displays the complete information of a fuel order identified by route param.
 * Allows the provider to dispatch, confirm delivery and close an order
 * by updating its status through the OrderingStore.
 */
@Component({
  selector: 'app-order-detail',
  imports: [
    DatePipe,
    DecimalPipe,
    TranslatePipe,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatChip,
    MatChipSet,
    MatProgressSpinner,
    MatError,
    MatTooltip,
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail {
  readonly store = inject(OrderingStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  orderId: string | null = null;
  order: Signal<Order | undefined> = computed(() => undefined);

  constructor() {
    this.route.params.subscribe(params => {
      this.orderId = params['id'] ?? null;

      if (this.orderId) {
        this.order = this.store.getOrderById(this.orderId);
      }
    });
  }

  back() {
    this.router.navigate(['/ordering/order-list']).then();
  }

  /**
   * Sprint 1 - US-12
   * Prevents premature dispatch status updates.
   * Creates a new order object without modifying the original.
   */
  dispatch(order: Order) {

    // Prevent invalid or duplicate dispatch requests
    if (order.status !== 'CREATED' || this.store.loading()) {
      return;
    }

    const now = new Date().toISOString();

    // Create a new order to preserve the original data
    const dispatchedOrder = new Order({
      id: order.id,
      requestId: order.requestId,
      clientId: order.clientId,
      providerId: order.providerId,
      productId: order.productId,
      quantity: order.quantity,
      unit: order.unit,
      totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress,
      status: 'DISPATCHED',
      dispatchedAt: now,
      deliveredAt: order.deliveredAt,
      closedAt: order.closedAt,
      createdAt: order.createdAt,
      updatedAt: now
    });

    // Send the updated order through the store
    this.store.updateOrder(dispatchedOrder);
  }

  /**
   * Confirms the delivery of a dispatched fuel order.
   */
  confirmDelivery(order: Order) {
    const now = new Date().toISOString();

    order.status = 'DELIVERED';
    order.deliveredAt = now;
    order.updatedAt = now;

    this.store.updateOrder(order);
  }

  /**
   * Closes a delivered fuel order.
   */
  closeOrder(order: Order) {
    const now = new Date().toISOString();

    order.status = 'CLOSED';
    order.closedAt = now;
    order.updatedAt = now;

    this.store.updateOrder(order);
  }

  /**
   * Returns the CSS class associated with the order status.
   */
  statusClass(status: string): string {
    return status.toLowerCase();
  }
}
