'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  MousePointerClick, 
  TextCursorInput, 
  Image as ImageIcon, 
  CreditCard, 
  FormInput 
} from 'lucide-react';

// Ye humare backend ke ParamType enum se match karte hain
const PALETTE_COMPONENTS = [
  { id: 'TEXT', label: 'Text Block', icon: Type },
  { id: 'BUTTON', label: 'Button', icon: MousePointerClick },
  { id: 'INPUT', label: 'Input Field', icon: TextCursorInput },
  { id: 'IMAGE', label: 'Image', icon: ImageIcon },
  { id: 'CARD', label: 'Card', icon: CreditCard },
  { id: 'SMART_FORM', label: 'Smart Form', icon: FormInput },
];

// Ye ek single draggable button hai
function DraggablePaletteItem({ id, label, icon: Icon }: { id: string, label: string, icon: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id, // Ye id sidha BuilderLayout ke handleDragEnd mein 'active.id' banke jayegi
    data: { label } // Extra data pass kar sakte hain
  });

  // Jab element drag ho raha ho, toh usko mouse ke saath move karne ka CSS
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 mb-2 rounded-md border bg-card text-card-foreground shadow-sm cursor-grab 
        hover:border-primary hover:bg-accent transition-colors
        ${isDragging ? 'opacity-50 z-50 shadow-lg cursor-grabbing border-primary' : ''}
      `}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default function ComponentPalette() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Components</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag these items to the canvas.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {PALETTE_COMPONENTS.map((comp) => (
          <DraggablePaletteItem 
            key={comp.id} 
            id={comp.id} 
            label={comp.label} 
            icon={comp.icon} 
          />
        ))}
      </div>
    </div>
  );
}