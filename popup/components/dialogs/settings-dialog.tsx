import { DesktopIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/popup/components/ui/select";
import { useTheme, type Theme } from "@/popup/hooks/storage/useTheme";

// --- Reusable setting row ---

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium">{label}</p>
        {description && (
          <p className="text-muted-foreground text-[10px]">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// --- Settings dialog ---

export function SettingsDialog() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="divide-border divide-y">
      <div className="pb-3">
        <h3 className="text-muted-foreground mb-3 text-[10px] font-medium tracking-wider uppercase">
          {chrome.i18n.getMessage("settingsSectionGeneral")}
        </h3>
        <div className="space-y-3">
          <SettingRow
            label={chrome.i18n.getMessage("settingsThemeLabel")}
            description={chrome.i18n.getMessage("settingsThemeDescription")}
          >
            <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="system">
                  <DesktopIcon className="size-3.5" />
                  {chrome.i18n.getMessage("themeSystem")}
                </SelectItem>
                <SelectItem value="light">
                  <SunIcon className="size-3.5" />
                  {chrome.i18n.getMessage("themeLight")}
                </SelectItem>
                <SelectItem value="dark">
                  <MoonIcon className="size-3.5" />
                  {chrome.i18n.getMessage("themeDark")}
                </SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </div>
      </div>
    </div>
  );
}
