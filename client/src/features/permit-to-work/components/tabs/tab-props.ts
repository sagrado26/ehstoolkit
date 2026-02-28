import type { Control, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { PermitFormData } from "../../types";

export interface TabProps {
  control: Control<PermitFormData>;
  register: UseFormRegister<PermitFormData>;
  errors: FieldErrors<PermitFormData>;
  watch: UseFormWatch<PermitFormData>;
  setValue: UseFormSetValue<PermitFormData>;
  onNext: () => void;
  onPrev?: () => void;
}
