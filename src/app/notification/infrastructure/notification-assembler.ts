import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Notification } from '../domain/model/notification.entity';
import { NotificationResource, NotificationsResponse } from './notification-response';

/**
 * NotificationAssembler
 *
 * Translates between Notification domain entities and API resource format.
 * Used by the notification infrastructure layer to map backend responses
 * into domain objects and prepare entities for API requests.
 */

export class NotificationAssembler
  implements BaseAssembler<Notification, NotificationResource, NotificationsResponse>
{
  toEntitiesFromResponse(response: NotificationsResponse): Notification[] {
    return response.notifications.map((r) => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: NotificationResource): Notification {
    return new Notification({
      id: resource.id,
      userId: resource.userId,
      orderId: resource.orderId,
      type: resource.type,
      message: resource.message,
      isRead: resource.isRead,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: Notification): NotificationResource {
    return {
      id: entity.id,
      userId: entity.userId,
      orderId: entity.orderId,
      type: entity.type,
      message: entity.message,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
    } as NotificationResource;
  }
}
