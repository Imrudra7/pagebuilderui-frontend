'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react'; // 🔥 Icon import hona zaroori hai

interface PropertiesPanelProps {
  selectedElement?: any;
  onUpdate: (id: string, updatedData: any) => void;
  onDelete: (id: string) => void;
}

export default function PropertiesPanel({ selectedElement, onUpdate, onDelete }: PropertiesPanelProps) {
  // Agar koi element select nahi kiya hai
  if (!selectedElement) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-30"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        <p className="text-sm">Select any component on the canvas to edit its properties.</p>
      </div>
    );
  }

  const handlePropChange = (key: string, value: string) => {
    onUpdate(selectedElement.id, {
      props: { ...selectedElement.props, [key]: value }
    });
  };

  return (
    <div className="flex flex-col h-full w-full">

      {/* 🔥 YE RAHA HEADER Jisme DELETE BUTTON HAI 🔥 */}
      <div className="mb-6 border-b pb-4 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Properties</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Editing: <span className="font-mono text-primary font-bold">{selectedElement.paramType}</span>
          </p>
        </div>

        {/* Delete Button */}
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(selectedElement.id)}
          title="Delete Component"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-5 flex-1 overflow-y-auto pr-2">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={selectedElement.displayName || ''}
            onChange={(e) => onUpdate(selectedElement.id, { displayName: e.target.value })}
          />
        </div>

        {selectedElement.paramType === 'BUTTON' && (
          <>
            <div className="grid w-full items-center gap-1.5 mt-2 pt-4 border-t">
              <Label htmlFor="actionUrl">Action URL</Label>
              <Input
                id="actionUrl"
                value={selectedElement.props?.actionUrl || ''}
                onChange={(e) => handlePropChange('actionUrl', e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5 mt-2">
              <Label htmlFor="variant">Button Style (Variant)</Label>
              <Input
                id="variant"
                placeholder="default, destructive, outline..."
                value={selectedElement.props?.variant || ''}
                onChange={(e) => handlePropChange('variant', e.target.value)}
              />
            </div>
          </>
        )}

        {selectedElement.paramType === 'INPUT' && (
          <div className="grid w-full items-center gap-1.5 mt-2 pt-4 border-t">
            <Label htmlFor="placeholder">Placeholder Text</Label>
            <Input
              id="placeholder"
              value={selectedElement.props?.placeholder || ''}
              onChange={(e) => handlePropChange('placeholder', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}