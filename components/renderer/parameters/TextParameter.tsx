import { ParameterResponse } from '@/types/schema';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface Props {
  parameter: ParameterResponse;
  isCardHeader?: boolean;
}

export default function TextParameter({ parameter, isCardHeader }: Props) {
  const uiProps = parameter.props || {};
  const textVariant = uiProps.variant || 'p';
  const textContent = uiProps.text || parameter.displayName;
  
  // Agar ye CardHeader ke andar render ho raha hai
  if (isCardHeader) {
    if (textVariant === 'title') return <CardTitle>{textContent}</CardTitle>;
    return <CardDescription>{textContent}</CardDescription>;
  }

  // Normal rendering (Bahar wale TEXT ke liye)
  if (textVariant === 'h1') return <h1 className="text-4xl font-extrabold tracking-tight mb-2">{textContent}</h1>;
  if (textVariant === 'h2') return <h2 className="text-3xl font-semibold tracking-tight mb-2">{textContent}</h2>;
  
  return <p className="leading-7 text-muted-foreground mb-2">{textContent}</p>;
}