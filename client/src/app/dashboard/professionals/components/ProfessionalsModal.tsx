import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { Professional } from "./ProfessionalsPage";
import ProfessionalsForm from "./ProfessionalsForm";

interface ProfessionalsModalProps {
    isModalOpen: boolean
    setIsModalOpen: (value: React.SetStateAction<boolean>) => void
    currentProfessional: Professional
    setCurrentProfessional: (value: React.SetStateAction<Professional>) => void
}


const ProfessionalsModal = ({ isModalOpen, setIsModalOpen, currentProfessional, setCurrentProfessional }: ProfessionalsModalProps) => {
    const t = useTranslations('ProfessionalsPage');
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {currentProfessional.id
                            ? t("modal.editTitle")
                            : t("modal.createTitle")}
                    </DialogTitle>
                </DialogHeader>
                <ProfessionalsForm
                    currentProfessional={currentProfessional}
                    setCurrentProfessional={setCurrentProfessional}
                    setIsModalOpen={setIsModalOpen}
                />
            </DialogContent>
        </Dialog>
    )
}

export default ProfessionalsModal