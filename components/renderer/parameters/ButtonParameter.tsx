import { ParameterResponse } from '@/types/schema';
import { Button } from '@/components/ui/button';

interface Props {
  parameter: ParameterResponse;
  onExecuteClick?: (paramKey: string, eventCode: string, methodsConfig: any) => void;
}

export default function ButtonParameter({ parameter, onExecuteClick }: Props) {
  const uiProps = parameter.props || {};
  const methods = uiProps.methods || {}; // Backend ka methods object
  // Safe Variant Checker
  const validVariants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
  const safeVariant = validVariants.includes(uiProps.variant) ? uiProps.variant : 'default';

  return (
    <Button
      variant={safeVariant as any}
      className={uiProps.width === 'full' ? 'w-full' : 'w-fit'}
      onClick={() => {
        if (methods.onClick) {
          onExecuteClick?.(
            parameter.paramKey,
            methods.onClick.action || 'DEFAULT_CLICK', // 2nd Arg: Event Code
            methods                                     // 3rd Arg: Methods Config
          );
        }
      }}
    >
      {uiProps.alias || uiProps.label || parameter.displayName}
    </Button>
  );
}