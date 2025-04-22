"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import api from "@/services/apiService";
import { useProfessionalStore } from "@/store/professionalStore";

import ProfessionalsModal from "./ProfessionalsModal";
import List, { ColumnDef } from "@/components/list/List";

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function ProfessionalsPage() {
  const t = useTranslations("ProfessionalsPage");
  const { professionals, fetchProfessionals } = useProfessionalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<
    Professional
  >({
    id: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/professionals/${id}`);
      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.remove"),
      });
      fetchProfessionals();
    } catch {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.remove"),
        variant: "destructive",
      });
    }
  };


  // Handle row click to view professional details
  const handleRowClick = (professional: Professional) => {
    console.log("Viewing professional details:", professional);
    // Navigate to professional details or show details modal
    // history.push(`/professionals/${professional.id}`);
  };

  const columns: ColumnDef<Professional>[] = [
    {
      id: "name",
      header: t("table.name"),
      accessorKey: "name"
    },
    {
      id: "email",
      header: t("table.email"),
      cell: (row) => row.email || <span className="text-gray-400 italic">{t("table.noEmail")}</span>
    },
    {
      id: "phone",
      header: t("table.phone"),
      cell: (row) => row.phone || <span className="text-gray-400 italic">{t("table.noPhone")}</span>
    },
    {
      id: "actions",
      header: t("table.actions"),
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentProfessional(row);
              setIsModalOpen(true);
            }}
          >
            {t("buttons.edit")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              handleRemove(row.id);
            }}
          >
            {t("buttons.remove")}
          </Button>
        </div>
      )
    },
  ];


  return (
    <div className="p-6 flex-1 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button
          onClick={() => {
            setCurrentProfessional({
              id: "",
              name: "",
              email: "",
              phone: "",
            });
            setIsModalOpen(true);
          }}
        >
          {t("buttons.addProfessional")}
        </Button>
      </div>


      <div className="bg-white rounded-lg shadow">
        <List<Professional>
          columns={columns}
          data={professionals}
          pageSize={10}
          onRowClick={handleRowClick}
          tableProps={{ className: "border-collapse" }}
        />
      </div>

      <ProfessionalsModal
        currentProfessional={currentProfessional}
        setCurrentProfessional={setCurrentProfessional}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
