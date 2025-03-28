import React, { useState } from "react";
import CreateAppointmentModal from "@/components/modals/CreateAppointmentModal";
import { Button } from "@/components/ui/button";

export default function BookAppointmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
      <Button onClick={() => setIsModalOpen(true)}>Create Appointment</Button>
      <CreateAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
