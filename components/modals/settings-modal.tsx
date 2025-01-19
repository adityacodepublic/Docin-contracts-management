"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { useSettings } from "@/hooks/use-settings";
import { useRouter } from "next/navigation";

export const SettingsModal = () => {
  const router = useRouter();
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Docin looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1 cursor-pointer" onClick={()=> Router.push('/admin')}>
            <Label>Manage User Roles</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Change user roles, and permissions 
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
