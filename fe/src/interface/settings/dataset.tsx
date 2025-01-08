import React from "react";
import { Circle, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const datasetStatus: Status[] = [
  {
    value: "lsc",
    label: "LSC",
    icon: Circle,
  },
  {
    value: "vbs",
    label: "VBS",
    icon: Circle,
  },
];

import { useGlobal } from "@/contexts/global.context";

import axios from "axios";
import { AxiosResponse } from "axios";

// sent request to server function
export function ComboboxDataset() {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    datasetStatus[0]
  );
  React.useEffect(() => {
    if (open) {
      let value = selectedStatus?.value;
      axios
        .get(`http://localhost:8080/${value}`)
        .then((response: AxiosResponse) => {
          console.log(response.data);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }, [open]); // This effect runs whenever `status` changes

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Dataset</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
            onClick={() => setOpen((open) => !open)}
          >
            {selectedStatus ? (
              <>
                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                {selectedStatus.label}
              </>
            ) : (
              <>+ Choose dataset</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {datasetStatus.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      setSelectedStatus(
                        datasetStatus.find(
                          (priority) => priority.value === value
                        ) || null
                      );
                      setOpen(false);
                    }}
                  >
                    <status.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        status.value === selectedStatus?.value
                          ? "opacity-100"
                          : "opacity-40"
                      )}
                    />
                    <span>{status.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
