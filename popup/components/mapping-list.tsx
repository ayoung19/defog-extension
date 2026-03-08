import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"

import type { Mapping } from "@/lib/types"

import { Button } from "./ui/button"

interface MappingListProps {
  mappings: Mapping[]
  onEdit: (mapping: Mapping) => void
  onDelete: (id: string) => void
}

export function MappingList({ mappings, onEdit, onDelete }: MappingListProps) {
  if (mappings.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
        <p className="text-sm">No mappings yet</p>
        <p className="mt-1 text-xs opacity-70">
          Add a pattern above to get started
        </p>
      </div>
    )
  }

  return (
    <div className="divide-border divide-y">
      {mappings.map((mapping) => (
        <div
          key={mapping.id}
          className="group hover:bg-secondary/50 flex items-center gap-2 px-3 py-2.5 transition-colors">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{mapping.label}</p>
            <p className="text-muted-foreground truncate font-mono text-[10px]">
              {mapping.pattern}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(mapping)}>
              <PencilSimpleIcon className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(mapping.id)}>
              <TrashIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
