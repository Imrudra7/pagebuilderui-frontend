'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import ParameterRenderer from '../renderer/ParameterRenderer';
import { ParameterResponse } from '@/types/schema';

interface CanvasAreaProps {
  elements: any[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
}

export default function CanvasArea({ elements, selectedElementId, onSelectElement }: CanvasAreaProps) {
  // Ye hook is div ko ek "Dropzone" bana deta hai
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-dropzone', // Ye ID BuilderLayout mein match karni chahiye
  });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Page Canvas</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drop components here to build your layout. Click to edit properties.
        </p>
      </div>

      {/* Main Dropzone Area */}
      <div 
        ref={setNodeRef}
        className={`
          flex-1 border-2 border-dashed rounded-lg p-6 transition-colors overflow-y-auto
          ${isOver ? 'border-primary bg-primary/5' : 'border-border bg-background/50'}
        `}
      >
        {/* Agar canvas khali hai */}
        {elements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="p-4 rounded-full bg-muted mb-2 shadow-sm border">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </div>
            <p className="font-medium">Drag and drop a component</p>
          </div>
        ) : (
          /* Agar elements hain toh unko line mein lagao */
          <div className="flex flex-col gap-6">
            {elements.map((el) => (
              <div 
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`
                  relative rounded-md p-4 bg-card cursor-pointer transition-all border-2
                  hover:border-primary/50
                  ${selectedElementId === el.id ? 'border-primary ring-4 ring-primary/20' : 'border-transparent shadow-sm'}
                `}
              >
                {/* Chhota sa label dikhane ke liye ki ye kya type ka component hai */}
                <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                  {el.paramType}
                </div>
                
                {/* PRO TRICK: pointer-events-none taaki button/input par click karne se wo trigger na ho, 
                    balki humara onClick (select karne wala) trigger ho */}
                <div className="pointer-events-none mt-2">
                  <ParameterRenderer parameter={el as ParameterResponse} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}