import { useState, Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UploadCloud, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import PDFUploadModal from "./PDFUploadModal";
import VideoModal from "./VideoModal";
import ChatModal from "./ChatModal";
import ContentTypeCard from "./ContentTypeCard";
import CreateCourseModal from "./CreateCourseModal";
import AudioRecordModal from "./AudioRecordModal";

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
}

export type ModalType =
  | "selection"
  | "upload"
  | "paste"
  | "chat"
  | "createCourse"
  | "recordAudio";

export type SetActiveModalType = Dispatch<SetStateAction<ModalType>>;

export function AddContentModal({ open, onClose }: AddContentModalProps) {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const isRTL = dir === "rtl";
  const [activeModal, setActiveModal] = useState<ModalType>("selection");

  function handleClose() {
    onClose();
    setActiveModal("selection");
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="sm:max-w-[600px]"
        dir={dir}
        lang={i18n.language}
      >
        {activeModal === "selection" && (
          <>
            <DialogHeader className={isRTL ? "text-right" : "text-left"}>
              <DialogTitle>
                {t("modals.addContent.title", "Add New Learning Playground")}
              </DialogTitle>
              <DialogDescription>
                {t(
                  "modals.addContent.subtitle",
                  "Choose how to add your content"
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <ContentTypeCard
                title={t("modals.addContent.uploadPdf.title", "Upload PDF")}
                subtitle={t(
                  "modals.addContent.uploadPdf.subtitle",
                  "Upload a PDF document"
                )}
                Icon={UploadCloud}
                isRTL={isRTL}
                onClick={() => setActiveModal("upload")}
              />
              <ContentTypeCard
                title={t("modals.addContent.pasteUrl.title", "Paste URL")}
                subtitle={t(
                  "modals.addContent.pasteUrl.subtitle",
                  "Add content from a link"
                )}
                Icon={Link2}
                isRTL={isRTL}
                onClick={() => setActiveModal("paste")}
              />
              {/* <div className="col-span-2">
                <ContentTypeCard
                  title={t(
                    "modals.addContent.chatWorkspace.title",
                    "Chat Workspace"
                  )}
                  subtitle={t(
                    "modals.addContent.chatWorkspace.subtitle",
                    "Start a workspace focused on conversation"
                  )}
                  Icon={MessageCircle}
                  isRTL={isRTL}
                  onClick={() => setActiveModal("chat")}
                />
              </div> */}
              {/* <ContentTypeCard
                title={t(
                  "modals.addContent.createCourse.title",
                  "Create Course"
                )}
                subtitle={t(
                  "modals.addContent.createCourse.subtitle",
                  "Generate a course from content"
                )}
                Icon={BookOpen}
                isRTL={isRTL}
                onClick={() => setActiveModal("createCourse")}
              />
              <ContentTypeCard
                title={t("modals.addContent.recordAudio.title", "Record Audio")}
                subtitle={t(
                  "modals.addContent.recordAudio.subtitle",
                  "Record and add audio content"
                )}
                Icon={Mic}
                isRTL={isRTL}
                onClick={() => setActiveModal("recordAudio")}
              />
              <ContentTypeCard
                title="Learngin Session"
                subtitle={t(
                  "modals.addContent.recordAudio.subtitle",
                  "Record and add audio content"
                )}
                Icon={PencilRulerIcon}
                isRTL={isRTL}
                onClick={() => setActiveModal("recordAudio")}
              />
              <ContentTypeCard
                title="Book Summary Workshop"
                subtitle={t(
                  "modals.addContent.recordAudio.subtitle",
                  "Record and add audio content"
                )}
                Icon={Spade}
                isRTL={isRTL}
                onClick={() => setActiveModal("recordAudio")}
              />
              <div className=" col-span-2">
                <ContentTypeCard
                  title={t("modals.addContent.research.title", "Research")}
                  subtitle={t(
                    "modals.addContent.research.subtitle",
                    "Do Your Research With Ease"
                  )}
                  Icon={TestTube}
                  isRTL={isRTL}
                  onClick={() => setActiveModal("recordAudio")}
                />
              </div> */}
            </div>
          </>
        )}

        {activeModal === "chat" && (
          <ChatModal
            setActiveModal={setActiveModal}
            handleClose={handleClose}
          />
        )}

        {activeModal === "upload" && (
          <PDFUploadModal setActiveModal={setActiveModal} />
        )}

        {activeModal === "paste" && (
          <VideoModal
            setActiveModal={setActiveModal}
            handleClose={handleClose}
          />
        )}

        {activeModal === "createCourse" && (
          <CreateCourseModal setActiveModal={setActiveModal} />
        )}

        {activeModal === "recordAudio" && (
          <AudioRecordModal setActiveModal={setActiveModal} />
        )}
      </DialogContent>
    </Dialog>
  );
}
