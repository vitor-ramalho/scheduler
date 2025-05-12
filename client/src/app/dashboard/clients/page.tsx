'use client'

import { useEffect, useState, useCallback } from "react";
import { Loader, AlertCircle, Check } from "lucide-react";

import List, { ColumnDef } from "@/components/list/List";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Client, fetchClients, addClient, updateClient, deleteClient } from "@/services/clientService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

const ClientsPage = () => {
  const t = useTranslations("ClientsPage");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error',
    message: string
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset form data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      if (currentClient) {
        setFormData({
          name: currentClient.name,
          email: currentClient.email,
          phone: currentClient.phone
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: ''
        });
      }
    }
  }, [isModalOpen, currentClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentClient(null);
  };

  const handleSaveClient = async () => {
    setIsSubmitting(true);
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: t("form.error"),
          description: t("form.allFieldsRequired"),
          variant: "destructive"
        });
        return;
      }

      if (currentClient) {
        // Update existing client
        await updateClient({
          ...formData,
          identifier: currentClient.identifier
        } as Client);

        setNotification({
          type: 'success',
          message: t("notifications.clientUpdated")
        });
      } else {
        // Create new client
        await addClient(formData as Client);
        setNotification({
          type: 'success',
          message: t("notifications.clientCreated")
        });
      }
      handleCloseModal();
      fetchData(); // Refresh client list
    } catch (err) {
      toast({
        title: t("errors.saveFailed"),
        description: err instanceof Error ? err.message : t("errors.unexpectedError"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = (identifier: string) => {
    setClientToDelete(identifier);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient(clientToDelete);
      setClients(clients.filter(c => c.identifier !== clientToDelete));
      setNotification({
        type: 'success',
        message: t("notifications.clientDeleted")
      });
    } catch (err) {
      toast({
        title: t("errors.deleteFailed"),
        description: err instanceof Error ? err.message : t("errors.unexpectedError"),
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleRowClick = (client: Client) => {
    // Navigate to client details page
    window.location.href = `/clients/${client.identifier}`;
  };

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Define columns with action buttons - FIXED the cell rendering functions
  const columns: ColumnDef<Client>[] = [
    {
      id: "name",
      header: t("table.name"),
      accessorKey: "name"
    },
    {
      id: "email",
      header: t("table.email"),
      accessorKey: "email",
      cell: ({ email }) => (
        <a
          href={`mailto:${email}`}
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {email}
        </a>
      )
    },
    {
      id: "phone",
      header: t("table.phone"),
      accessorKey: "phone",
      cell: ({ phone }) => (
        <a
          href={`tel:${phone}`}
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {phone}
        </a>
      )
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
              e.stopPropagation(); // Prevent row click
              setCurrentClient(row);
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
              handleRemove(row.identifier);
            }}
          >
            {t("buttons.remove")}
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={() => {
          setCurrentClient(null);
          setIsModalOpen(true);
        }}>
          {t("buttons.addClient")}
        </Button>
      </div>

      {notification && (
        <div className={`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex items-center">
            {notification.type === 'success' ? <Check className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <List<Client>
            columns={columns}
            data={clients}
            pageSize={10}
            onRowClick={handleRowClick}
            tableProps={{ className: "border-collapse" }}
            caption={clients.length === 0 ? t("clients.noClientsFound") : undefined}
          />
        )}
      </div>

      {/* Client Edit/Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentClient ? t("modal.editClient") : t("modal.addClient")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("form.name")}</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("form.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("form.phone")}</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
              {t("buttons.cancel")}
            </Button>
            <Button onClick={handleSaveClient} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {t("buttons.saving")}
                </>
              ) : (
                t("buttons.save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialog.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialog.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("buttons.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t("buttons.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;