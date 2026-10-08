/**
 * Base resource interface representing a minimal API resource with a string UUID.
 * @remarks All API responses from the FuelBridge Spring Boot backend return
 * resources with UUID string identifiers.
 * @author FuelBridge Platform
 */
export interface BaseResource {
  /**
   * The unique identifier of the resource (UUID string).
   */
  id: string;
}

/**
 * Base response interface for paginated or wrapped API responses.
 * @remarks Extend this interface when the backend wraps results in a
 * pagination envelope (e.g. { content: [], totalPages: N }).
 * @author FuelBridge Platform
 */
export interface BaseResponse {}
