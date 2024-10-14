type InputType = "text" | "password" | "select" | "area" | "number";
interface labelValue {
  label: string;
  value: string | number;
}
export interface RenderInputProps {
  label: string;
  value: string | number | labelValue;
  type: InputType;
  optionSelect?: string[];
  onChange: (text: string) => void;
  error?: string | null;
  onBlur?: () => void;
}
