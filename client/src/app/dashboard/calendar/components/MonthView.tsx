import { getDaysInMonth, getFirstDayOfMonth } from "@/utils/dateUtils";
import { useTranslations } from "next-intl";

interface MonthViewProps {
  currentDate: Date;
  events: any;
  setView: () => void;
  setCurrentDate: () => void;
}

const MonthView = ({
  currentDate,
  events,
  setView,
  setCurrentDate,
}: MonthViewProps) => {
  const t = useTranslations("CalendarPage");
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

export default MonthView;
