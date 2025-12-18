import { Button } from "@/components/ui/button";

const ActionsButtons = ({ onClose, isSubmitting, isFormValid, handleConfirm }: { onClose: () => void, isSubmitting: boolean, isFormValid: () => boolean, handleConfirm: () => Promise<void> }): React.ReactNode => {
    return <div className="flex px-[20px] w-full gap-7 pb-[24px] justify-center lg:justify-between mt-[16px] lg:px-[45px] lg:mt-[32px]">
        <Button
            type="button"
            className="text-neutral-black-80 bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[151px] h-[40px] lg:w-[200px] lg:h-[48px]"
            onClick={onClose}
            disabled={isSubmitting}
        >
            CERRAR
        </Button>
        <Button
            className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[151px] h-[40px] lg:w-[200px] lg:h-[48px]"
            disabled={isSubmitting || !isFormValid()}
            onClick={handleConfirm}
        >
            CONFIRMAR
        </Button>
    </div>;
}

export default ActionsButtons;