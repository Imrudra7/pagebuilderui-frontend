'use client';

import { ParameterResponse } from '@/types/schema';
import TextParameter from './parameters/TextParameter';
import InputParameter from './parameters/InputParameter';
import ButtonParameter from './parameters/ButtonParameter';

interface ParameterRendererProps {
  parameter: ParameterResponse;
  isCardHeader?: boolean;
  slug: string;
  value?: any; 
  onInputChange?: (paramKey: string, value: any, methodsConfig: any) => void;
  onBtnClick?: (paramKey: string, eventCode: string, methodsConfig: any) => void;
}

// 🔥 FIX: Destructuring mein 'value', 'onInputChange', aur 'onBtnClick' ko add kiya
export default function ParameterRenderer({ 
  parameter, 
  isCardHeader, 
  value, 
  onInputChange, 
  onBtnClick 
}: ParameterRendererProps) {
  const safeParamType = String(parameter.paramType || '').trim().toUpperCase();

  switch (safeParamType) {
    case 'TEXT':
      return <TextParameter parameter={parameter} isCardHeader={isCardHeader} />;

    case 'INPUT_TEXT':
    case 'INPUT_EMAIL':
    case 'INPUT_PASSWORD':
      return (
        <InputParameter 
          parameter={parameter} 
          value={value} 
          onExecuteChange={onInputChange} 
        />
      );

    case 'BUTTON':
      return (
        <ButtonParameter 
          parameter={parameter} 
          onExecuteClick={onBtnClick}
        />
      );

    default:
      console.warn(`[ParameterRenderer] Unknown type: ${safeParamType}`);
      return null;
  }
}