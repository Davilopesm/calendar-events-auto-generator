import databaseConnection from '../database-connection';

interface UserEventUpdatableData {
  id?: string
  user_id?: number
  title: string
  url: string
  start: string
  end: string
}

export default class UserEventRepository {
  async findByUserId (userId: number): Promise<UserEventUpdatableData[]> {
    console.log('Finding event with user id', userId);
    return await databaseConnection('user_event').where({
      user_id: userId
    }).select('*');
  }

  async update (id: string, newEvent: UserEventUpdatableData): Promise<void> {
    console.log('Updating event with id', id);
    return await databaseConnection('user_event')
      .where({ id })
      .update(newEvent)
  }

  async insert (userId: number, event: UserEventUpdatableData): Promise<void> {
    console.log(`Adding event with id ${event.id} for user ${userId}`);
    await databaseConnection('user_event')
      .insert({
        id: event.id,
        user_id: userId,
        title: event.title,
        url: event.url,
        start: event.start,
        end: event.end
      })
  }

  async delete (id: string): Promise<void> {
    console.log(`Deleting event ${id} from database`);
    await databaseConnection('user_event')
      .where({ id })
      .del()
  }
}
