import { useTranslations } from "next-intl";
import Timeline from "./Timeline";
import { IEvent } from "./CalendarPage";

interface WeekViewProps {
  currentDate: Date;
  events: IEvent[];
}

const WeekView = ({ currentDate, events }: WeekViewProps) => {
  const dates = [];
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const t = useTranslations("CalendarPage");

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }

  // Helper function to filter events for a specific date
  const getEventsForDate = (targetDate: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === targetDate.toDateString();
    });
  };

  return (
    <div className="flex w-full overflow-hidden">
      {dates.map((date, index) => {
        const dayEvents = getEventsForDate(date);
        
        return (
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
            <Timeline currentDate={date} events={dayEvents} key={`${index}-${date.toDateString()}`} />
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
