import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

// Extraer los estados y unidades en Union Types ayuda a reutilizarlos en otros componentes
//export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
//export type Unit = 'LITERS' | 'GALLONS';


/**
 * @summary Resource DTO para solicitudes de combustible.
 * @remarks Define la estructura de respuesta del backend para Requests.
 * @Diego FuelBridge Platform
 */



export interface RequestResource extends BaseResource {
  id: string;
  clientId: string;
  providerId: string;
  productId: string;
  quantity: number;
  unit: string;
  desiredDeliveryDate: string;
  deliveryAddress: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestsResponse extends BaseResponse {
  requests: RequestResource[];
}
