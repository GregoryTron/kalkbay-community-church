import React, { useState, useEffect } from 'react';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Event } from '../../types';
import { imageCache } from '../../services/imageCache';
import { formatEventDate } from '../../utils/dateUtils';

interface EventCardProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete, isAdmin }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (inView && event.imageUrl) {
      if (imageCache.hasImage(event.imageUrl)) {
        setImageLoaded(true);
      } else {
        imageCache.preloadImage(event.imageUrl)
          .then(() => setImageLoaded(true))
          .catch(console.error);
      }
    }
  }, [inView, event.imageUrl]);

  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-700 transform ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="h-48 overflow-hidden relative">
        {imageLoaded ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <Edit className="h-5 w-5 text-gray-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onDelete();
                  }
                }}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{event.title}</h3>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <Clock className="h-5 w-5 mr-2" />
          <span>{event.time}</span>
          {event.date && <span className="ml-2">| {formatEventDate(event.date)}</span>}
        </div>
        <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;