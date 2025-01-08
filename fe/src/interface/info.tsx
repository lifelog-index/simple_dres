import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobal } from "@/contexts/global.context";
import React, { useState } from "react";
import { toast } from "sonner";

export function ChangeInfo() {
  const { loginCallBack } = useGlobal();
  const { globalUsername, setGlobalUsername } = useGlobal();
  const { defaultDresTrack, setDefaultDresTrack, updateServerDefaultTrack } =
    useGlobal();
  const { globalPassword, setGlobalPassword } = useGlobal();

  const handleSaveChanges = () => {
    // Perform any necessary validation or data processing here
    // Call the login callback with the updated user and password
    updateServerDefaultTrack(defaultDresTrack);
    loginCallBack(globalUsername, globalPassword);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">User information</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={globalUsername}
              className="col-span-3"
              onChange={(e) => setGlobalUsername(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              value={globalPassword}
              className="col-span-3"
              onChange={(e) => setGlobalPassword(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="default" className="text-right">
              Track
            </Label>
            <Input
              id="default track"
              value={defaultDresTrack}
              className="col-span-3"
              onChange={(e) => setDefaultDresTrack(e.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
