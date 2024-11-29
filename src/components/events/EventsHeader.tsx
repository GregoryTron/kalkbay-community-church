import React from 'react';
import { Plus } from 'lucide-react';

interface EventsHeaderProps {
  onAddEvent: () => void;
  isAdmin: boolean;
}

const EventsHeader: React.FC<EventsHeaderProps> = ({ onAddEvent, isAdmin }) => {
  return (
    <div className="flex justify-center items-center mb-12">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Recent Events</h2>
      {isAdmin && (
        <button
          onClick={onAddEvent}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-4"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Event
        </button>
      )}
    </div>
  );
};

export default EventsHeader;