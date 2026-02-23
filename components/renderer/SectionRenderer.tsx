"use client"
import { SectionResponse } from '@/types/schema';
import ParameterRenderer from './ParameterRenderer';
import { Card, CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from '@/components/ui/card';
import { controllers } from '@/lib/controllers';
import { useState } from 'react';

interface SectionRendererProps {
  section: SectionResponse;
  pageSlug: string; 
}

export default function SectionRenderer({ section, pageSlug }: SectionRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const safeSlug = String(pageSlug);
  const controller = (controllers as Record<string, any>)[safeSlug] || {};

  // --- Handlers ---
  const onInputChange = (paramKey: string, value: any, methodsConfig: any) => {
    const updatedData = { ...formData, [paramKey]: value };
    setFormData(updatedData);
    
    if (methodsConfig?.onChange) {
      const { methodName, path } = methodsConfig.onChange;
      if (controller[methodName]) {
        controller[methodName]({ paramKey, value, path, formData: updatedData });
      }
    }
  };

  const onBtnClick = (paramKey: string, eventCode: string, methodsConfig: any) => {
    if (methodsConfig?.onClick) {
      const method = methodsConfig.onClick;
      if (controller[method.methodName]) {
        controller[method.methodName]({
          paramKey,
          eventCode, 
          method,
          formData
        });
      }
    }
  };

  // --- Parameter Filtering Logic (Robust approach) ---
  const sortedParameters = section.parameters
    ? [...section.parameters].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    : [];

  // Inputs: Wo parameters jo user se data lete hain
  const inputParams = sortedParameters.filter(p => 
    String(p.paramType).startsWith('INPUT') || p.paramType === 'CHECKBOX' || p.paramType === 'SELECT'
  );

  // Actions: Wo parameters jo click event trigger karte hain
  const actionParams = sortedParameters.filter(p => 
    p.paramType === 'BUTTON' || p.paramType === 'LINK'
  );

  // Display: Baaki bache huye (TEXT, IMAGE, etc.) jo Header mein jayenge
  const displayParams = sortedParameters.filter(p => 
    !inputParams.includes(p) && !actionParams.includes(p)
  );

  const safeLayout = String(section.layout || '').trim().toUpperCase();

  // --- Shared Header Component (For non-card layouts) ---
  const renderSectionHeader = () => {
    if (!section.displayName && !section.description) return null;
    return (
      <div className="mb-8 space-y-2 text-left px-2">
        {section.displayName && (
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {section.displayName}
          </h2>
        )}
        {section.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {section.description}
          </p>
        )}
      </div>
    );
  };

  // 🔥 1. PORTRAIT Layout (Card UI)
  if (safeLayout === 'PORTRAIT') {
    return (
      <section id={section.sectionKey} className="flex min-h-[85vh] items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-primary transition-all duration-300">
          
          <CardHeader className='space-y-3 pb-6'>
            <div className="space-y-1">
                <CardTitle className="text-2xl font-black tracking-tight text-primary">
                    {section.displayName || 'Welcome'}
                </CardTitle>
                {section.description && (
                    <CardDescription className="text-sm font-medium">
                        {section.description}
                    </CardDescription>
                )}
            </div>
            
            {/* Display elements (TEXT, IMAGE parameters) */}
            {displayParams.length > 0 && (
              <div className="pt-2">
                {displayParams.map((param) => (
                  <ParameterRenderer 
                    key={param.id} 
                    parameter={param} 
                    isCardHeader={true} 
                    slug={safeSlug} 
                  />
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              {inputParams.map((param) => (
                <ParameterRenderer 
                  key={param.id} 
                  parameter={param} 
                  slug={safeSlug}
                  value={formData[param.paramKey] || ''}
                  onInputChange={onInputChange}
                  onBtnClick={onBtnClick} 
                />
              ))}
            </form>
          </CardContent>

          {actionParams.length > 0 && (
            <CardFooter className="flex flex-col gap-3 pt-4">
              {actionParams.map((param) => (
                <ParameterRenderer 
                  key={param.id} 
                  parameter={param} 
                  slug={safeSlug}
                  onInputChange={onInputChange}
                  onBtnClick={onBtnClick} 
                />
              ))}
            </CardFooter>
          )}
        </Card>
      </section>
    );
  }

  // 🔥 2. Regular Layout Logic (GRID, FLEX, etc.)
  let layoutClasses = '';
  switch (safeLayout) {
    case 'GRID': layoutClasses = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'; break;
    case 'FLEX': layoutClasses = 'flex flex-wrap gap-6 items-start justify-between'; break;
    case 'CONTAINER': layoutClasses = 'flex flex-col gap-8 max-w-5xl mx-auto'; break;
    default: layoutClasses = 'flex flex-col gap-6 w-full';
  }

  return (
    <section id={section.sectionKey} className="w-full py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {renderSectionHeader()}
        
        <div className={layoutClasses}>
          {sortedParameters.map((param) => (
            <ParameterRenderer 
              key={param.id} 
              parameter={param}
              value={formData[param.paramKey] || ''}
              onInputChange={onInputChange}
              onBtnClick={onBtnClick} 
              slug={safeSlug} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}