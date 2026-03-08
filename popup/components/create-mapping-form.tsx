import { PlusIcon } from "@phosphor-icons/react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/popup/components/ui/button"
import { Input } from "@/popup/components/ui/input"
import { useMappings } from "@/popup/hooks/storage/useMappings"

interface FormValues {
  pattern: string
  label: string
}

export function CreateMappingForm() {
  const [mappings, setMappings] = useMappings()

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: { pattern: "", label: "" }
  })

  const submit = (values: FormValues) => {
    const exists = mappings.some(
      (m) => m.pattern.toLowerCase() === values.pattern.toLowerCase()
    )
    if (exists) {
      setError("pattern", { message: "This pattern already exists" })
      return
    }
    setMappings([
      ...mappings,
      { id: crypto.randomUUID(), pattern: values.pattern, label: values.label }
    ])
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-2 px-3 py-3">
      <div className="space-y-1">
        <Controller
          control={control}
          name="pattern"
          rules={{ required: "Pattern is required" }}
          render={({ field }) => (
            <Input
              autoFocus
              placeholder="Pattern to match (e.g. a UUID)"
              className={errors.pattern ? "border-destructive" : ""}
              {...field}
            />
          )}
        />
        {errors.pattern && (
          <p className="text-destructive text-xs">{errors.pattern.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Controller
          control={control}
          name="label"
          rules={{ required: "Label is required" }}
          render={({ field }) => (
            <Input
              placeholder="Readable label (e.g. Andy)"
              className={errors.label ? "border-destructive" : ""}
              {...field}
            />
          )}
        />
        {errors.label && (
          <p className="text-destructive text-xs">{errors.label.message}</p>
        )}
      </div>
      <Button type="submit" size="sm" className="w-full">
        <PlusIcon className="mr-1.5 size-3.5" weight="bold" />
        Add Mapping
      </Button>
    </form>
  )
}
