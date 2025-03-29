"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { useSettings } from "@/hooks/use-settings";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

export const SettingsModal = () => {
  const user = useUser();
  const router = useRouter();
  const settings = useSettings();

  const isAdmin = user.user && user.user.publicMetadata.role === "admin";

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Docin looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
        {isAdmin && (
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => {
              router.push("/admin");
              settings.onClose();
            }}
          >
            <div className="flex flex-col gap-y-1">
              <Label className="cursor-pointer">Manage User Roles</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                Change user roles, and permissions
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
