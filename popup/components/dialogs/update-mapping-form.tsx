import { Controller, useForm } from "react-hook-form";

import { Button } from "@/popup/components/ui/button";
import { Input } from "@/popup/components/ui/input";

interface FormValues {
  pattern: string;
  label: string;
}

interface UpdateMappingFormProps {
  defaultValues: FormValues;
  onSave: (pattern: string, label: string) => void;
  onClose: () => void;
}

export function UpdateMappingForm({
  defaultValues,
  onSave,
  onClose,
}: UpdateMappingFormProps) {
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues });

  const submit = (values: FormValues) => {
    onSave(values.pattern, values.label);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <div className="space-y-2">
        <Controller
          control={control}
          name="pattern"
          rules={{ required: true }}
          render={({ field }) => (
            <Input autoFocus placeholder="Pattern to match" {...field} />
          )}
        />
        <Controller
          control={control}
          name="label"
          rules={{ required: true }}
          render={({ field }) => (
            <Input placeholder="Readable label" {...field} />
          )}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" className="flex-1">
          Save
        </Button>
      </div>
    </form>
  );
}
