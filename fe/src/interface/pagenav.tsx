import React from "react";

import { useGlobal } from "@/contexts/global.context";
import { toast } from "sonner";

export function PageNavigation() {
  const { currPage, setCurrPage } = useGlobal();
  const { rerank } = useGlobal();
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (currPage > 1) {
          setCurrPage(currPage - 1);
          toast("", {
            description: `Go to page ${currPage - 1}`,
          });
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [currPage]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        rerank();
        setCurrPage(currPage + 1);
        toast("", {
          description: `Go to page ${currPage + 1}`,
        });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [currPage]);
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>H / K
        </kbd>
        {" or "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Ctrl</span>H / K
        </kbd>{" "}
        to navigate between pages
      </p>
    </>
  );
}
