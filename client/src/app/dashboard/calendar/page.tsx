"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("day");

  // Sample events with more detailed timing
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meeting",
      start: new Date(2024, 2, 26, 14, 0),
      end: new Date(2024, 2, 26, 15, 30),
      color: "bg-blue-200",
    },
    {
      id: 2,
      title: "Client Call",
      start: new Date(2024, 2, 26, 16, 15),
      end: new Date(2024, 2, 26, 16, 45),
      color: "bg-green-200",
    },
    {
      id: 3,
      title: "Project Review",
      start: new Date(2024, 2, 26, 10, 0),
      end: new Date(2024, 2, 26, 11, 15),
      color: "bg-purple-200",
    },
  ]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const renderMonthView = () => {
    const days = generateMonthView();
    return (
      <div className="grid grid-cols-7 gap-1 p-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold text-gray-600 p-2">
            {day}
          </div>
        ))}
        {days.map((date, index) => (
          <div
            key={index}
            className={`
              border min-h-[120px] p-2 
              ${date ? "hover:bg-gray-50" : "bg-gray-50"}
              ${
                date && date.toDateString() === new Date().toDateString()
                  ? "border-blue-500 border-2"
                  : "border-gray-200"
              }
            `}
          >
            {date && (
              <div className="flex flex-col">
                <span className="text-sm text-right">{date.getDate()}</span>
                {events
                  .filter(
                    (event) =>
                      event.start.toDateString() === date.toDateString()
                  )
                  .map((event, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-blue-100 text-blue-800 rounded mt-1 p-1 truncate"
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Generate time slots (15-minute intervals) between 7 AM and 8 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push({
          time: new Date(2024, 2, 26, hour, minute),
          events: events.filter((event) => {
            const slotStart = new Date(2024, 2, 26, hour, minute);
            const slotEnd = new Date(2024, 2, 26, hour, minute + 15);
            return event.start < slotEnd && event.end > slotStart;
          }),
        });
      }
    }
    return slots;
  };

  const renderTimeline = (date) => {
    const timeSlots = generateTimeSlots();

    return (
      <div className="relative w-full">
        {timeSlots.map((slot, index) => {
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
                {slot.events.map((event) => {
                  // Calculate positioning and duration
                  const startMinuteOfDay =
                    event.start.getHours() * 60 + event.start.getMinutes();
                  const slotMinuteOfDay =
                    slot.time.getHours() * 60 + slot.time.getMinutes();
                  const eventDuration = (event.end - event.start) / (1000 * 60); // duration in minutes

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
                      `}
                        style={{
                          height: `${Math.max(eventDuration, 15)}px`, // Minimum 15-minute height
                          minHeight: "30px",
                        }}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-xs">
                          {event.start.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}{" "}
                          -
                          {event.end.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Week view with multiple day timelines
  const renderWeekView = () => {
    const dates = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return (
      <div className="flex w-full overflow-hidden">
        {dates.map((date, index) => (
          <div key={index} className="flex-1 border-r">
            <div className="text-center font-semibold mb-2">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            {renderTimeline(date)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <button
            onClick={() =>
              setCurrentDate((prev) => {
                const newDate = new Date(prev);
                newDate.setDate(prev.getDate() - (view === "week" ? 7 : 1));
                return newDate;
              })
            }
          >
            <ChevronLeft />
          </button>
          <h2 className="text-xl font-bold">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
              day: view === "day" ? "numeric" : undefined,
            })}
          </h2>
          <button
            onClick={() =>
              setCurrentDate((prev) => {
                const newDate = new Date(prev);
                newDate.setDate(prev.getDate() + (view === "week" ? 7 : 1));
                return newDate;
              })
            }
          >
            <ChevronRight />
          </button>
        </div>

        {/* View Selector */}
        <div className="flex space-x-2">
          {["day", "week", "month"].map((viewOption) => (
            <button
              key={viewOption}
              className={`
                px-4 py-2 rounded capitalize 
                ${
                  view === viewOption
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }
              `}
              onClick={() => setView(viewOption)}
            >
              {viewOption}
            </button>
          ))}
        </div>

        {/* Add Event Button */}
        <button
          className="bg-teal-600 text-white p-2 rounded-full"
          title="Add Event"
        >
          <Plus />
        </button>
      </div>

      {/* Calendar View */}
      <div className="flex-grow overflow-auto w-full">
        {view === "month" && renderMonthView()}
        {view === "day" && renderTimeline(currentDate)}
        {view === "week" && renderWeekView()}
      </div>
    </div>
  );
};

export default CalendarPage;
