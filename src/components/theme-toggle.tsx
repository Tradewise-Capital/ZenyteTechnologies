import { Moon, Sun } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { isLight, setLight } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Moon className="size-4 text-muted-foreground" aria-hidden="true" />
      <Switch checked={isLight} onCheckedChange={setLight} aria-label="Toggle light mode" />
      <Sun className="size-4 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}
