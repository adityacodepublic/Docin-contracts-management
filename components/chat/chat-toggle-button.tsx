"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatToggleButtonProps {
  documentContent: string;
}

const ChatToggleButton = ({ documentContent }: ChatToggleButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    const encodedContent = encodeURIComponent(documentContent);
    router.push(`/chat?content=${encodedContent}`);
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 h-12 w-12 rounded-full"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

export default ChatToggleButton;

