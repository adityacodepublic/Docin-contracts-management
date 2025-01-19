"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import EnhancedChatBot from "./enhanced-chat-bot";

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent: string;
}

export const ChatDialog = ({
  isOpen,
  onClose,
  documentContent
}: ChatDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 gap-0 rounded-2xl">
        <div className="flex flex-col h-full">
          <EnhancedChatBot documentContent={documentContent} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
