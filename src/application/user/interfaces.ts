import { CalendarEvent } from '../../core/domain/user/entities/calendar-event';

export interface PaginatedResponse {
  items: CalendarEvent[]
  self: string
  next: string
}
