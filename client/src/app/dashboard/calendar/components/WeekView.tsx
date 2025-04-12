import { useTranslations } from "next-intl";
import Timeline from "./Timeline";

interface WeekViewProps {
  currentDate: Date;
  events: any;
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
          {<Timeline currentDate={currentDate} events={events} key={index} />}
        </div>
      ))}
    </div>
  );
};

export default WeekView;
