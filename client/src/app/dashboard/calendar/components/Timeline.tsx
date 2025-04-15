import React from 'react';
import EventActionsModal from '@/components/modals/EventActionsModal';

interface Event {
  id: string;
  clientName: string;
  start: Date;
  end: Date;
  color: string;
}

interface TimelineProps {
  currentDate: Date;
  events: Event[];
}

const Timeline = ({ currentDate, events }: TimelineProps) => {
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    const selectedDate = new Date(currentDate); // Use the selected day
    selectedDate.setHours(0, 0, 0, 0); // Reset time to midnight

    for (let hour = 7; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour, minute);

        slots.push({
          time: slotTime,
          events: events.filter((event: Event) => {
            const eventStart = new Date(event.start); // Convert to Date object
            const eventEnd = new Date(event.end); // Convert to Date object
            const slotStart = new Date(slotTime);
            const slotEnd = new Date(slotTime);
            slotEnd.setMinutes(slotEnd.getMinutes() + 15);
            return eventStart < slotEnd && eventEnd > slotStart;
          }),
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full">
      {timeSlots.map((slot, index) => {
        console.log("Rendering time slot:", slot);
        // Format time display
        const timeString = slot.time.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <div
            key={index}
            className="flex border-b border-gray-200 h-12 hover:bg-gray-50"
          >
            {/* Time Label */}
            {slot.time.getMinutes() === 0 && (
              <div className="w-20 text-right pr-2 text-gray-500 self-start pt-1">
                {timeString}
              </div>
            )}

            {/* Event Slot */}
            <div className="flex-grow relative">
              {slot.events.map((event: Event) => {
                console.log("Rendering event:", event);
                const startMinuteOfDay =
                  event.start.getHours() * 60 + event.start.getMinutes();
                const slotMinuteOfDay =
                  slot.time.getHours() * 60 + slot.time.getMinutes();
                const eventDuration = (event.end.getTime() - event.start.getTime()) / (1000 * 60); // duration in minutes

                // Determine if this slot is the start of the event
                const isEventStart = startMinuteOfDay === slotMinuteOfDay;

                return (
                  isEventStart && (
                    <div
                      key={event.id}
                      className={`
                            absolute w-full ${event.color} 
                            rounded p-1 text-sm
                            border-l-4 border-blue-500
                            overflow-hidden
                            cursor-pointer
                          `}
                      style={{
                        height: `${Math.max(eventDuration, 15)}px`, // Minimum 15-minute height
                        minHeight: "30px",
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="font-semibold truncate">{event.clientName}</div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Event Actions Modal */}
      {selectedEvent && (
        <EventActionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default Timeline;
