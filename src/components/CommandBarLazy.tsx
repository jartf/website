import { useEffect, useRef, useState, type ComponentType } from "react";

import type { CommandBarProps } from "@/components/CommandBar";
import { useKeyboardNavigation, isTypingInInput } from "@/hooks";

type CommandBarComponent = ComponentType<CommandBarProps>;

export function CommandBarLazy() {
  useKeyboardNavigation();

  const [CommandBar, setCommandBar] = useState<CommandBarComponent | null>(null);
  const openOnLoadRef = useRef(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (CommandBar) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "." || e.metaKey || e.ctrlKey) return;
      if (CommandBar) return;
      if (isTypingInInput()) return;

      e.preventDefault();
      openOnLoadRef.current = true;

      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      import("@/components/CommandBar")
        .then((mod) => {
          setCommandBar(() => mod.CommandBar as CommandBarComponent);
        })
        .catch(() => {
          isLoadingRef.current = false;
        });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [CommandBar]);

  if (!CommandBar) return null;
  return <CommandBar initialOpen={openOnLoadRef.current} />;
}
