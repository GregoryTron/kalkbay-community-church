import React, { useState } from 'react';
import { toast } from 'sonner';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { Event } from '../../types';
import { deleteEvent } from '../../services/eventService';
import EventList from './EventList';
import EventsHeader from './EventsHeader';
import EventModal from '../EventModal';
import EventsSkeleton from './EventsSkeleton';

const EventsContainer: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const { events, loading } = useEvents();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = async (eventId: string, imageUrl: string) => {
    try {
      await deleteEvent(eventId, imageUrl);
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return <EventsSkeleton />;
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsHeader 
          onAddEvent={() => setShowModal(true)}
          isAdmin={isAdmin}
        />
        
        {events.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No events available yet.
          </p>
        ) : (
          <EventList
            events={events}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {showModal && (
          <EventModal
            event={selectedEvent}
            onClose={() => {
              setShowModal(false);
              setSelectedEvent(undefined);
            }}
            onSave={async (eventData) => {
              // Event saving logic is handled by the modal
              setShowModal(false);
              setSelectedEvent(undefined);
            }}
            isEditing={!!selectedEvent}
          />
        )}
      </div>
    </section>
  );
};

export default EventsContainer;