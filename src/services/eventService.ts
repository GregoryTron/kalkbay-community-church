import { ref, set, push, get } from 'firebase/database';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { database, storage } from '../lib/firebase';
import { Event } from '../types';
import { cacheService } from './cache';

export const deleteEvent = async (eventId: string, imageUrl: string) => {
  // Delete event from database
  const eventRef = ref(database, `events/${eventId}`);
  await set(eventRef, null);

  // Delete image from storage if it exists
  if (imageUrl && imageUrl.includes('firebase')) {
    const imageRef = storageRef(storage, imageUrl);
    try {
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Continue even if image deletion fails
    }
  }

  // Update cache
  const cachedEvents = cacheService.get<Event[]>('events') || [];
  const updatedEvents = cachedEvents.filter(event => event.id !== eventId);
  cacheService.set('events', updatedEvents);
};