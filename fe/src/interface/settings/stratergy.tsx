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
import { useGlobal } from "@/contexts/global.context";

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const strategies: Status[] = [
  {
    value: "linear",
    label: "Linear search",
    icon: Circle,
  },
  {
    value: "saliency",
    label: "Saliency search",
    icon: Circle,
  },
];

const defaultStatus = strategies[0];
export function ComboboxStrategy() {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] =
    React.useState<Status>(defaultStatus);
  const { changeStrategy } = useGlobal();
  React.useEffect(() => {
    changeStrategy(selectedStatus.value);
  }, [selectedStatus]); // This effect runs whenever `status` changes
  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Strategy</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
          >
            {selectedStatus ? (
              <>
                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                {selectedStatus.label}
              </>
            ) : (
              <>+ Choose strategy</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {strategies.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      setSelectedStatus(
                        strategies.find(
                          (priority) => priority.value === value
                        ) || defaultStatus
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
