export const environment = {
  production: false,
  // Base API URL
  serverBasePath: 'http://localhost:8080/api/v1',
  // IAM (Identity and Access Management)
  iamSignInEndpointPath: '/authentication/sign-in',
  iamSignUpEndpointPath: '/authentication/sign-up',
  iamRecoverPasswordEndpointPath: '/auth/recover-password',
  // Inventory (Productos e Inventario)
  inventoryEndpointPath: '/inventory',
  inventoryProductsEndpointPath: '/inventory',
  inventoryStockEndpointPath: '/inventory',
  // Ordering (Solicitudes y Órdenes)
  orderingRequestsEndpointPath: '/requests',
  orderingOrdersEndpointPath: '/orders',
  // Fulfillment (Logística y Despacho)
  fulfillmentVehiclesEndpointPath: '/vehicles',
  fulfillmentDriversEndpointPath: '/drivers',
  fulfillmentDeliveriesEndpointPath: '/deliveries',
  // Payment (Transacciones y Pagos)
  paymentTransactionsEndpointPath: '/payment/transactions',
  paymentPaymentsEndpointPath: '/payment/payments',
  // Notification (Notificaciones)
  notificationEndpointPath: '/notifications',
  // Reporting (Reportes y Analytics)
  reportingReportsEndpointPath: '/reporting/reports',
  reportingKpisEndpointPath: '/reporting/kpis',
  reportingSalesEndpointPath: '/reporting/sales',
  reportingConsumptionEndpointPath: '/reporting/consumption',
  reportingMonthlyRevenueEndpointPath: '/monthly-revenue',  // ← agregar esto

};
