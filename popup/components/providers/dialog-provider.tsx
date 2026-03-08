import { createContext, useContext, useState, type ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/popup/components/ui/dialog"

interface DialogOptions {
  title: string
  description?: string
  content: ReactNode
  className?: string
}

interface DialogContextValue {
  open: (options: DialogOptions) => void
  close: () => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<DialogOptions | null>(null)

  const open = (opts: DialogOptions) => {
    setOptions(opts)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setTimeout(() => setOptions(null), 200)
  }

  return (
    <DialogContext.Provider value={{ open, close }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(v) => !v && close()}>
        {options && (
          <DialogContent className={options.className}>
            <DialogHeader>
              <DialogTitle>{options.title}</DialogTitle>
              {options.description && (
                <DialogDescription>{options.description}</DialogDescription>
              )}
            </DialogHeader>
            {options.content}
          </DialogContent>
        )}
      </Dialog>
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error("useDialog must be used within DialogProvider")
  return ctx
}
