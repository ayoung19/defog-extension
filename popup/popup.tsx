import {
  GearIcon,
  LightningIcon,
  LightningSlashIcon,
} from "@phosphor-icons/react";
import { useEffect } from "react";

import { type Mapping } from "@/lib/types";
import { CreateMappingForm } from "@/popup/components/create-mapping-form";
import { SettingsDialog } from "@/popup/components/dialogs/settings-dialog";
import { UpdateMappingForm } from "@/popup/components/dialogs/update-mapping-form";
import { MappingList } from "@/popup/components/mapping-list";
import { useDialog } from "@/popup/components/providers/dialog-provider";
import { Button } from "@/popup/components/ui/button";
import { useEnabled } from "@/popup/hooks/storage/useEnabled";
import { useMappings } from "@/popup/hooks/storage/useMappings";
import { useTheme } from "@/popup/hooks/storage/useTheme";
import { cn } from "@/popup/lib/utils";

function resolveTheme(theme: string) {
  if (theme !== "system") return theme === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function Popup() {
  const dialog = useDialog();

  const [mappings, setMappings] = useMappings();
  const [enabled, setEnabled] = useEnabled();
  const [theme] = useTheme();

  useEffect(() => {
    const apply = () =>
      document.documentElement.classList.toggle("dark", resolveTheme(theme));

    apply();

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  const updateMapping = (id: string, pattern: string, label: string) => {
    setMappings(
      mappings.map((m) => (m.id === id ? { ...m, pattern, label } : m)),
    );
  };

  const deleteMapping = (id: string) => {
    setMappings(mappings.filter((m) => m.id !== id));
  };

  const openSettings = () => {
    dialog.open({
      title: "Settings",
      content: <SettingsDialog />,
    });
  };

  const openEditMapping = (mapping: Mapping) => {
    dialog.open({
      title: "Edit mapping",
      content: (
        <UpdateMappingForm
          defaultValues={{ pattern: mapping.pattern, label: mapping.label }}
          onSave={(pattern, label) => updateMapping(mapping.id, pattern, label)}
          onClose={() => dialog.close()}
        />
      ),
    });
  };

  return (
    <div className="bg-background text-foreground w-[450px] font-mono">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold tracking-tight">Defog</h1>
          <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
            {mappings.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={openSettings}>
            <GearIcon className="text-muted-foreground size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEnabled(!enabled)}
          >
            {enabled ? (
              <LightningIcon className="text-primary size-4" weight="fill" />
            ) : (
              <LightningSlashIcon className="text-muted-foreground size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Add Form */}
      <CreateMappingForm />

      <div className="border-border border-t" />

      {/* Mapping List */}
      <div className="no-scrollbar max-h-[300px] overflow-y-auto">
        <MappingList
          mappings={mappings}
          onEdit={openEditMapping}
          onDelete={deleteMapping}
        />
      </div>

      {/* Status bar */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors",
          enabled
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "inline-block size-1.5 rounded-full",
            enabled ? "bg-primary-foreground" : "bg-muted-foreground",
          )}
        />
        {enabled
          ? `${mappings.length} replacement${mappings.length !== 1 ? "s" : ""} active`
          : "Paused"}
      </div>
    </div>
  );
}
