import { Button } from "@/components/ui/button";

const ActionsButtons = ({
  onClose,
  isSubmitting,
  isFormValid,
  handleConfirm,
}: {
  onClose: () => void;
  isSubmitting: boolean;
  isFormValid: () => boolean;
  handleConfirm: () => Promise<void>;
}): React.ReactNode => {
  return (
    <div className="flex px-[20px] w-full gap-7 pb-[24px] justify-center lg:justify-between mt-[16px] lg:px-[45px] lg:mt-[32px]">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-[151px] lg:w-[200px]"
        onClick={onClose}
        disabled={isSubmitting}
      >
        CERRAR
      </Button>
      <Button
        variant="primary"
        size="lg"
        className="w-[151px] lg:w-[200px]"
        disabled={isSubmitting || !isFormValid()}
        onClick={handleConfirm}
        loading={isSubmitting}
      >
        CONFIRMAR
      </Button>
    </div>
  );
};

export default ActionsButtons;
