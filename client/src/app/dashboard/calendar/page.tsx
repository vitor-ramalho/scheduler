"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react";
import CreateAppointmentModal from "@/components/modals/CreateAppointmentModal";
import { useTranslations } from "next-intl";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useProfessionalStore } from "@/store/professionalStore";

const CalendarPage = () => {
  const t = useTranslations("CalendarPage");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { appointments, loading, error, fetchAppointments } =
    useAppointmentStore();

  const { professionals, fetchProfessionals } = useProfessionalStore();

  console.log("professionals:", professionals);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchProfessionals();
    };
    fetchInitialData();
  }, [fetchProfessionals]);

  useEffect(() => {
    if (professionals.length > 0 && !selectedProfessional) {
      setSelectedProfessional(professionals[0].id);
    }
  }, [professionals, selectedProfessional]);

  useEffect(() => {
    if (selectedProfessional) {
      fetchAppointments(selectedProfessional);
    }
  }, [selectedProfessional, fetchAppointments]);

  const handleProfessionalChange = (event) => {
    setSelectedProfessional(event.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const selectProfessional = (professionalId) => {
    setSelectedProfessional(professionalId);
    setIsDropdownOpen(false);
  };

  const mapAppointmentsToEvents = () => {
    return appointments.map((appointment) => {
      const start = new Date(appointment.startDate);
      const end = new Date(appointment.endDate);

      // Ensure the start and end dates are properly set
      start.setSeconds(0, 0); // Remove any sub-second precision
      end.setSeconds(0, 0);

      return {
        id: appointment.id,
        start,
        end,
        color: "bg-blue-200",
        clientName: appointment.client?.name || "Unknown Client", // Include client name
      };
    });
  };
  const events = mapAppointmentsToEvents();

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

    // Previous month's days to fill beginning of grid
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

    // Fill in days from previous month
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDate = new Date(
        prevYear,
        prevMonth,
        prevMonthDays - firstDay + i + 1
      );
      days.push(prevMonthDate);
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Next month's days to complete the grid
    const remainingCells = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const nextMonthDate = new Date(nextYear, nextMonth, i);
      days.push(nextMonthDate);
    }

    return days;
  };

  const renderMonthView = () => {
    const days = generateMonthView();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return (
      <div className="grid grid-cols-7 gap-1 p-2">
        {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((dayKey) => (
          <div key={dayKey} className="text-center font-bold text-gray-600 p-2">
            {t(`weekdays.${dayKey}`)}
          </div>
        ))}
        {days.map((date, index) => {
          const eventsForDay = events.filter(
            (event) =>
              event.start.getFullYear() === date.getFullYear() &&
              event.start.getMonth() === date.getMonth() &&
              event.start.getDate() === date.getDate()
          );

          const isCurrentMonth =
            date.getFullYear() === currentYear &&
            date.getMonth() === currentMonth;

          return (
            <div
              key={index}
              className={`
                border min-h-[120px] p-2 cursor-pointer
                ${isCurrentMonth ? "bg-white" : "bg-gray-100"}
                ${
                  date.toDateString() === new Date().toDateString()
                    ? "border-blue-500 border-2"
                    : "border-gray-200"
                }
              `}
              onClick={() => {
                setCurrentDate(date);
                setView("day");
              }}
            >
              <div className="flex flex-col">
                <span
                  className={`
                    text-sm text-right 
                    ${!isCurrentMonth ? "text-gray-400" : "text-black"}
                  `}
                >
                  {date.getDate()}
                </span>

                {/* Event Indicator */}
                {eventsForDay.length > 0 && (
                  <div className="mt-2 flex justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Generate time slots (15-minute intervals) between 7 AM and 8 PM
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
          events: events.filter((event) => {
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

  const renderTimeline = (date) => {
    const timeSlots = generateTimeSlots();

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
                {slot.events.map((event) => {
                  console.log("Rendering event:", event);
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
                        <div className="font-semibold">{event.clientName}</div>{" "}
                        {/* Render client name */}
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
              {t(
                "weekdays." +
                  date
                    .toLocaleDateString("en-US", { weekday: "short" })
                    .toLowerCase()
              )}
              , {date.getDate()}{" "}
              {t(
                "months." +
                  date
                    .toLocaleDateString("en-US", { month: "short" })
                    .toLowerCase()
              )}
            </div>
            {renderTimeline(date)}
          </div>
        ))}
      </div>
    );
  };

  // Month navigation method
  const navigate = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === "day") {
        newDate.setDate(prev.getDate() + direction); // Move by one day
      } else if (view === "week") {
        newDate.setDate(prev.getDate() + direction * 7); // Move by one week
      } else {
        newDate.setMonth(prev.getMonth() + direction); // Move by one month
      }
      return newDate;
    });
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-4">{t("loading")}</div>;
    }

    if (error) {
      return (
        <div className="text-center p-4 text-red-500">
          {t("error")}: {error}
        </div>
      );
    }

    return (
      <>
        {view === "month" && renderMonthView()}
        {view === "day" && renderTimeline(currentDate)}
        {view === "week" && renderWeekView()}
      </>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 p-2 rounded"
            title={t("navigation.previous")}
          >
            <ChevronLeft />
          </button>
          <h2 className="text-xl font-bold">
            {t(
              "months." +
                currentDate
                  .toLocaleDateString("en-US", { month: "long" })
                  .toLowerCase()
            )}{" "}
            {currentDate.getFullYear()}
            <span className="text-gray-500 text-lg ml-2">
              (
              {t(
                "weekdays." +
                  currentDate
                    .toLocaleDateString("en-US", { weekday: "short" })
                    .toLowerCase()
              )}
              , {currentDate.getDate()})
            </span>
          </h2>
          <button
            onClick={() => navigate(1)}
            className="hover:bg-gray-100 p-2 rounded"
            title={t("navigation.next")}
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
              {t(`views.${viewOption}`)}
            </button>
          ))}
        </div>

        {/* Add Event Button */}
        <button
          className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700"
          title={t("addEvent")}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus />
        </button>
      </div>

      {/* Professional Selector Dropdown */}
      <div className="relative p-4 border-b bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          {t("selectProfessionalTitle", { defaultMessage: "Select Professional" })}
        </h3>
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
        >
          <span>
            {selectedProfessional
              ? professionals.find((p) => p.id === selectedProfessional)?.name ||
                t("placeholders.selectProfessional")
              : t("placeholders.selectProfessional")}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                onClick={() => selectProfessional(professional.id)}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {professional.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calendar View */}
      <div className="flex-grow overflow-auto w-full">{renderContent()}</div>

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CalendarPage;
