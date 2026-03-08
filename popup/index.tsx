import "@fontsource/jetbrains-mono"

import { useState } from "react"

import { Button } from "@/popup/components/ui/button"
import { Input } from "@/popup/components/ui/input"
import { Switch } from "@/popup/components/ui/switch"

import "./index.built.css"

function IndexPopup() {
  const [enabled, setEnabled] = useState(true)

  return (
    <div className="bg-background text-foreground w-[380px] p-4 font-mono">
      <div className="border-border flex items-center justify-between border-b pb-3">
        <h1 className="text-base font-semibold tracking-tight">Defog</h1>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {enabled ? "Active" : "Paused"}
          </span>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </div>

      <div className="space-y-3 pt-3">
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs">Pattern</label>
          <Input placeholder="e.g. 550e8400-e29b..." />
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs">Label</label>
          <Input placeholder="e.g. Order #1234" />
        </div>
        <div className="flex gap-2">
          <Button className="flex-1">Add Mapping</Button>
          <Button variant="outline">Clear</Button>
        </div>
      </div>

      <div className="border-border mt-3 border-t pt-3">
        <p className="text-muted-foreground text-[11px]">
          Lyra theme preview — JetBrains Mono
        </p>
      </div>
    </div>
  )
}

export default IndexPopup
