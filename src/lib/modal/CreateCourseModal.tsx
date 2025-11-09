import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { t } from "i18next";
import { SetActiveModalType } from "./AddContantModal";

export default function CreateCourseModal({
  setActiveModal,
}: {
  setActiveModal: SetActiveModalType;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t("modals.addContent.createCourse.title", "Create Course")}
        </DialogTitle>
        <DialogDescription>
          {t(
            "modals.addContent.createCourse.helper",
            "Course creation functionality goes here."
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
