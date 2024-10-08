type InputType = "text" | "password" | "select";
export interface RenderInputProps {
  label: string;
  value: string;
  type: InputType;
  optionSelect?: string[];
  onChange: (text: string) => void;
  error?: string | null;
}
