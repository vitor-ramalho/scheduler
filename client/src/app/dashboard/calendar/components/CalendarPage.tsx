"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react";
import CreateAppointmentModal from "@/components/modals/CreateAppointmentModal";
import { useTranslations } from "next-intl";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useProfessionalStore } from "@/store/professionalStore";
import MonthView from "./MonthView";
import Timeline from "./Timeline";
import WeekView from "./WeekView";
import ProfessionalsModal from "../../professionals/components/ProfessionalsModal";
import { Professional } from "../../professionals/components/ProfessionalsPage";

export interface IEvent {
  id: string,
  start: Date,
  end: Date,
  clientName: string,
  color: string
}

const CalendarPage = () => {
  const t = useTranslations("CalendarPage");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<Professional>({
    id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
  const [isProfessionalsLoading, setIsProfessionalsLoading] = useState(true);

  const { appointments, loading, error, fetchAppointments } = useAppointmentStore();
  const { professionals, fetchProfessionals } = useProfessionalStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsProfessionalsLoading(true);
      await fetchProfessionals();
      setIsProfessionalsLoading(false);
    };
    fetchInitialData();
  }, [fetchProfessionals]);

  useEffect(() => {

    if (!isProfessionalsLoading) {
      if (professionals.length > 0 && !selectedProfessional) {
        setSelectedProfessional(professionals[0].id);
      } else if (professionals.length === 0) {
        setIsProfessionalModalOpen(true);
      }
    }
  }, [professionals, selectedProfessional, isProfessionalsLoading]);

  useEffect(() => {
    if (selectedProfessional) {
      fetchAppointments(selectedProfessional);
    }
  }, [selectedProfessional, fetchAppointments]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const selectProfessional = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setIsDropdownOpen(false);
  };

  const mapAppointmentsToEvents: () => IEvent[] = () => {
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

  // Month navigation method
  const navigate = (direction: number) => {
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
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            setView={setView}
            setCurrentDate={setCurrentDate}
          />
        )}
        {view === "day" && (
          <Timeline currentDate={currentDate} events={events} />
        )}
        {view === "week" && (
          <WeekView currentDate={currentDate} events={events} />
        )}
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
                ${view === viewOption
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
          {t("selectProfessionalTitle", {
            defaultMessage: "Select Professional",
          })}
        </h3>
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
        >
          <span>
            {selectedProfessional
              ? professionals.find((p) => p.id === selectedProfessional)
                ?.name || t("placeholders.selectProfessional")
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
      <div className="flex-grow overflow-auto w-full">
        {isProfessionalsLoading ? (
          <div className="text-center p-4">{t("loading")}</div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ProfessionalsModal
        currentProfessional={currentProfessional}
        setCurrentProfessional={setCurrentProfessional}
        isModalOpen={isProfessionalModalOpen}
        setIsModalOpen={setIsProfessionalModalOpen}
      />
    </div>
  );
};

export default CalendarPage;