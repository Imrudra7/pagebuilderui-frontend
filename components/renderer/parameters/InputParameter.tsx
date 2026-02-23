import { ParameterResponse } from '@/types/schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  parameter: ParameterResponse;
  value?: any; // 🔥 Backend state se aane wali current value
  onExecuteChange?: (paramKey: string, value: any, methods: any) => void; // 🔥 Decoder function
}

export default function InputParameter({ parameter, value, onExecuteChange }: Props) {
  const uiProps = parameter.props || {};
  const methods = uiProps.methods || {}; // 🔥 Backend methods object (onChange, onBlur etc.)
  const safeParamType = String(parameter.paramType || '').trim().toUpperCase();

  // Common Handler for all input types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Sirf tab call karo jab onExecuteChange exist kare aur methods config ho
    onExecuteChange?.(parameter.paramKey, newValue, methods);
  };

  // Optional: Agar backend se onBlur ka logic bhi handle karna ho
  const handleBlur = () => {
    if (methods.onBlur && onExecuteChange) {
      // Blur par hum current value hi bhejte hain but with different context in methods
      onExecuteChange(parameter.paramKey, value, methods);
    }
  };

  // 1. Password Input Handle
  if (safeParamType === 'INPUT_PASSWORD') {
    return (
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor={parameter.paramKey}>{uiProps.label || parameter.displayName}</Label>
          {uiProps.forgotPasswordLink && (
            <a href={uiProps.forgotPasswordLink} className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
              {uiProps.forgotPasswordText || 'Forgot your password?'}
            </a>
          )}
        </div>
        <Input
          id={parameter.paramKey}
          type="password"
          value={value || ''} // 🔥 Controlled component
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={uiProps.placeholder}
          required={parameter.validationRules?.required || uiProps.required || false}
        />
      </div>
    );
  }

  // 2. Normal Inputs (Text, Email, etc.) Handle
  return (
    <div className="grid gap-2">
      <Label htmlFor={parameter.paramKey}>{uiProps.label || parameter.displayName}</Label>
      <Input
        id={parameter.paramKey}
        type={safeParamType === 'INPUT_EMAIL' ? 'email' : 'text'}
        value={value || ''} // 🔥 Controlled component
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={uiProps.placeholder}
        required={parameter.validationRules?.required || uiProps.required || false}
      />
    </div>
  );
}