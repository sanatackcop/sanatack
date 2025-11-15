import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetActiveModalType } from "./AddContantModal";
import { Button } from "@/components/ui/button";
import { t } from "i18next";

export default function AudioRecordModal({
  setActiveModal,
}: {
  setActiveModal: SetActiveModalType;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t("modals.addContent.recordAudio.title", "Record Audio")}
        </DialogTitle>
        <DialogDescription>
          {t(
            "modals.addContent.recordAudio.helper",
            "Audio recording functionality goes here."
          )}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className={`flex gap-2`}>
        <Button variant="outline" onClick={() => setActiveModal("selection")}>
          {t("common.back", "Back")}
        </Button>
      </DialogFooter>
    </>
  );
}
