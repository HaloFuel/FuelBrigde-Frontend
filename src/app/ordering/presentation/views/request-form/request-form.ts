import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderingStore } from '../../../application/ordering.store';
import { Request } from '../../../domain/model/request.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

/**
 * RequestForm - New Fuel Order Placement Form (US-05)
 *
 * Allows a buyer to submit a new fuel purchase request by specifying
 * the provider, product, quantity, delivery date and address.
 * Supports both create and edit modes depending on route params.
 */

@Component({
  selector: 'app-request-form',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField, MatLabel, MatError, MatInput,
    MatButton,
    MatSelect, MatOption,
    MatDatepicker, MatDatepickerInput, MatDatepickerToggle,
    MatNativeDateModule,
  ],
  templateUrl: './request-form.html',
  styleUrl: './request-form.css',
})
export class RequestForm {
  private fb     = inject(FormBuilder);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(OrderingStore);

  // Reactive form group for fuel request creation and editing

  form = this.fb.group({
    clientId:            new FormControl<string>('',   { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    providerId:          new FormControl<string>('',   { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    productId:           new FormControl<string>('',   { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    quantity:            new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    unit:                new FormControl<string>('LITERS', { nonNullable: true, validators: [Validators.required] }),
    desiredDeliveryDate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    deliveryAddress:     new FormControl<string>('',   { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  // Flag to determine if the form is in edit mode

  isEdit     = false;
  requestId: string | null = null;

  // Minimum allowed delivery date is today
  readonly minDate = new Date();


  // Supported quantity units for fuel requests
  readonly units = [
    { value: 'LITERS',  label: 'unit.liters'  },
    { value: 'GALLONS', label: 'unit.gallons' },
  ];

  constructor() {
    this.route.params.subscribe(params => {
      this.requestId = params['id'] ?? null;
      this.isEdit    = !!this.requestId;
      if (this.isEdit && this.requestId) {
        const request = this.store.getRequestById(this.requestId)();
        if (request) {
          this.form.patchValue({
            clientId:            request.clientId,
            providerId:          request.providerId,
            productId:           request.productId,
            quantity:            request.quantity,
            unit:                request.unit,
            desiredDeliveryDate: request.desiredDeliveryDate ? new Date(request.desiredDeliveryDate) : null,
            deliveryAddress:     request.deliveryAddress,
          });
        }
      }
    });
  }

  /**
   * Submits the form to create or update a fuel request.
   * Navigates back to the request list on success.
   */

  submit() {
    if (this.form.invalid) return;

    const now     = new Date().toISOString();
    const dateVal = this.form.value.desiredDeliveryDate;
    const desired = dateVal instanceof Date ? dateVal.toISOString() : new Date(dateVal!).toISOString();

    const request = new Request({
      id:                  this.requestId ?? '',
      clientId:            this.form.value.clientId!,
      providerId:          this.form.value.providerId!,
      productId:           this.form.value.productId!,
      quantity:            this.form.value.quantity!,
      unit:                this.form.value.unit!,
      desiredDeliveryDate: desired,
      deliveryAddress:     this.form.value.deliveryAddress!,
      status:              'PENDING_APPROVAL',
      rejectionReason:     null,
      createdAt:           now,
      updatedAt:           now,
    });

    if (this.isEdit) {
      this.store.updateRequest(request);
    } else {
      this.store.addRequest(request);
    }
    this.router.navigate(['/ordering/request-list']).then();
  }


  /**
   * Cancels the form and navigates back to the request list.
   */
  cancel() {
    this.router.navigate(['/ordering/request-list']).then();
  }
}
