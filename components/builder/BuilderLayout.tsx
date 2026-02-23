'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

import ComponentPalette from './ComponentPalette';
import CanvasArea from './CanvasArea';
import PropertiesPanel from './PropertiesPanel';

export default function BuilderLayout() {
  const [canvasElements, setCanvasElements] = useState<any[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || over.id !== 'canvas-dropzone') return;

    const newItem = {
      id: `param-${Date.now()}`,
      paramType: active.id,
      displayName: `New ${active.id}`,
      props: {}
    };
    
    setCanvasElements((prev) => [...prev, newItem]);
    setSelectedElementId(newItem.id); // Naya element drop hote hi select ho jaye
  };

  // 1. Real-time Update function
  const updateElement = (id: string, updatedData: any) => {
    setCanvasElements((prev) => 
      prev.map((el) => el.id === id ? { ...el, ...updatedData } : el)
    );
  };

  // 2. Delete function
  const deleteElement = (id: string) => {
    setCanvasElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElementId(null);
  };

  // 3. Save function (JSON generate karne ke liye)
  const handleSave = () => {
    const pagePayload = {
      title: "Draft Page",
      // Abhi ke liye hum saare parameters ko ek default "FULLWIDTH" section mein daal rahe hain
      sections: [
        {
          sectionKey: "main-section",
          layout: "FULLWIDTH",
          isVisible: true,
          parameters: canvasElements.map((el, index) => ({
            ...el,
            orderIndex: index + 1
          }))
        }
      ]
    };
    
    console.log("Saving to Database:", JSON.stringify(pagePayload, null, 2));
    alert("Page Saved! Check browser console for the JSON structure.");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      
      {/* Top Header for Save Button */}
      <div className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <h1 className="font-bold text-lg tracking-tight">SDUI Builder</h1>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save Page
        </Button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r bg-muted/10 p-4 overflow-y-auto">
            <ComponentPalette />
          </div>

          <div className="flex-1 bg-muted/20 p-8 overflow-y-auto relative">
            <CanvasArea 
              elements={canvasElements} 
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId} 
            />
          </div>

          <div className="w-80 border-l bg-muted/10 p-4 overflow-y-auto">
            <PropertiesPanel 
              selectedElement={canvasElements.find(el => el.id === selectedElementId)} 
              onUpdate={updateElement}
              onDelete={deleteElement}
            />
          </div>
        </div>
      </DndContext>
    </div>
  );
}