import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Utility functions for date manipulation
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  // Get current month and year
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Events (you can expand this later)
  const events = [
    { date: new Date(2024, 2, 26), title: "Team Meeting" },
    { date: new Date(2024, 2, 27), title: "Product Review" },
  ];

  // Generate calendar days for month view
  const generateMonthView = () => {
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

  // Generate week view (7 days from current date)
  const generateWeekView = () => {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(
        year,
        month,
        currentDate.getDate() - currentDate.getDay() + i
      );
      week.push(date);
    }
    return week;
  };

  // Generate day view (single day)
  const generateDayView = () => {
    return [currentDate];
  };

  // Navigate between months
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Render method for different views
  const renderView = () => {
    switch (view) {
      case "month":
        return renderMonthView();
      case "week":
        return renderWeekView();
      case "day":
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  const renderMonthView = () => {
    const days = generateMonthView();
    return (
      <div className="grid grid-cols-7 gap-1 p-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold text-gray-600">
            {day}
          </div>
        ))}
        {days.map((date, index) => (
          <div
            key={index}
            className={`
              border p-2 min-h-[100px] 
              ${date ? "hover:bg-gray-100" : "bg-gray-50"}
              ${
                date && date.toDateString() === new Date().toDateString()
                  ? "border-blue-500 border-2"
                  : "border-gray-200"
              }
            `}
          >
            {date && (
              <div className="flex flex-col">
                <span className="text-sm">{date.getDate()}</span>
                {events
                  .filter(
                    (event) => event.date.toDateString() === date.toDateString()
                  )
                  .map((event, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-blue-100 text-blue-800 rounded mt-1 p-1"
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

  const renderWeekView = () => {
    const week = generateWeekView();
    return (
      <div className="grid grid-cols-7 gap-2 p-4">
        {week.map((date, index) => (
          <div
            key={index}
            className="border p-2 min-h-[200px] hover:bg-gray-50"
          >
            <div className="text-center font-bold mb-2">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            {events
              .filter(
                (event) => event.date.toDateString() === date.toDateString()
              )
              .map((event, idx) => (
                <div
                  key={idx}
                  className="bg-blue-100 text-blue-800 rounded p-2 mt-2"
                >
                  {event.title}
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const day = generateDayView()[0];
    return (
      <div className="p-4">
        <div className="text-center text-2xl font-bold mb-4">
          {day.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="space-y-4">
          {events
            .filter((event) => event.date.toDateString() === day.toDateString())
            .map((event, idx) => (
              <div key={idx} className="bg-blue-100 text-blue-800 rounded p-4">
                {event.title}
              </div>
            ))}
          {events.filter(
            (event) => event.date.toDateString() === day.toDateString()
          ).length === 0 && (
            <div className="text-center text-gray-500">
              No events for this day
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => changeMonth(-1)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            <ChevronLeft />
          </button>
          <h2 className="text-xl font-bold">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${
              view === "day" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("day")}
          >
            Day
          </button>
          <button
            className={`px-4 py-2 rounded ${
              view === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("week")}
          >
            Week
          </button>
          <button
            className={`px-4 py-2 rounded ${
              view === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("month")}
          >
            Month
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">{renderView()}</div>
    </div>
  );
};

export default CalendarPage;
