type InputType = "text" | "password" | "select" | "area" | "number";
export interface RenderInputProps {
  label: string;
  value: string | number;
  type: InputType;
  optionSelect?: string[];
  onChange: (text: string) => void;
  error?: string | null;
  onBlur?: () => void;
}
