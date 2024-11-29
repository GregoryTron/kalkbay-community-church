import React from 'react';
import EventCard from './EventCard';
import { Event } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface EventListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string, imageUrl: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEditEvent, onDeleteEvent }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isAdmin={isAdmin}
          onEdit={() => onEditEvent(event)}
          onDelete={() => onDeleteEvent(event.id, event.imageUrl)}
        />
      ))}
    </div>
  );
};

export default EventList;