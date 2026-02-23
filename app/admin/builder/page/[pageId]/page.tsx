'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Plus, Settings, Layers, X, Loader2, ArrowRight } from 'lucide-react';
import { sectionAPI } from '@/lib/api'; 

export default function SectionManagerPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;

  // States
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // 🔥 Edit & Delete States
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sectionKey: '',
    displayName: '',
    layout: 'FULLWIDTH',
    orderIndex: 1, 
    isVisible: true,
  });

  // 1. Fetch Sections on Mount
  useEffect(() => {
    if (pageId) fetchSections();
  }, [pageId]);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const data = await sectionAPI.getSectionsByPage(pageId);
      // Hamesha orderIndex ke ascending order mein sort karo
      const sortedData = data.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
      setSections(sortedData);
    } catch (error: any) {
      console.error("Failed to fetch sections:", error);
      setApiError("Sections load karne mein error aayi.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Open Create Modal
  const handleCreateClick = () => {
    const nextOrder = sections.length > 0 
      ? Math.max(...sections.map(s => s.orderIndex)) + 1 
      : 1;

    setEditingSectionId(null);
    setFormData({
      sectionKey: '',
      displayName: '',
      layout: 'FULLWIDTH',
      orderIndex: nextOrder,
      isVisible: true,
    });
    setApiError('');
    setIsModalOpen(true);
  };

  // 🔥 3. Open Edit Modal
  const handleEditClick = (section: any) => {
    setEditingSectionId(section.id);
    setFormData({
      sectionKey: section.sectionKey, // Ye form mein disabled rahega
      displayName: section.displayName || '',
      layout: section.layout || 'FULLWIDTH',
      orderIndex: section.orderIndex || 1,
      isVisible: section.isVisible !== false, // Default true if undefined
    });
    setApiError('');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseInt(value) || 1 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔥 4. Submit Form (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setApiError('');
      
      if (editingSectionId) {
        // UPDATE API CALL
        await sectionAPI.updateSection(pageId, editingSectionId, {
          displayName: formData.displayName,
          layout: formData.layout,
          orderIndex: formData.orderIndex,
          isVisible: formData.isVisible,
        });
      } else {
        // CREATE API CALL
        await sectionAPI.addSection(pageId, {
          sectionKey: formData.sectionKey,
          displayName: formData.displayName,
          layout: formData.layout,
          orderIndex: formData.orderIndex,
          isVisible: formData.isVisible,
        });
      }

      setIsModalOpen(false);
      setEditingSectionId(null);
      fetchSections(); // Refresh the sorted list
      
    } catch (error: any) {
      setApiError(error.message || "Failed to save section.");
    } finally {
      setIsCreating(false);
    }
  };

  // 🔥 5. Delete Section
  const handleDeleteClick = async (sectionId: string, sectionName: string) => {
    if (window.confirm(`Are you sure you want to delete section "${sectionName}"?`)) {
      try {
        setIsDeletingId(sectionId);
        await sectionAPI.deleteSection(pageId, sectionId);
        fetchSections(); // Refresh list
      } catch (error: any) {
        alert(error.message || "Failed to delete section");
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const goToParameterBuilder = (sectionId: string) => {
    router.push(`/admin/builder/section/${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-muted/10 p-8 w-full text-foreground relative">
      
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <button 
          onClick={() => router.push('/admin/builder')}
          className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Sections</h1>
            <p className="text-muted-foreground mt-1 font-mono text-xs">Page ID: {pageId}</p>
          </div>
          <Button onClick={handleCreateClick} className="gap-2">
            <Plus className="w-4 h-4" /> Add New Section
          </Button>
        </div>
      </div>

      {apiError && !isModalOpen && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {apiError}
        </div>
      )}

      {/* Sections List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p>Loading sections...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-4xl">
          {sections.length === 0 ? (
            <Card className="border-dashed flex flex-col items-center justify-center text-muted-foreground py-16">
              <Layers className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium text-lg">No sections yet</p>
              <p className="text-sm mt-1 mb-4">Add your first layout section to start building.</p>
              <Button onClick={handleCreateClick} variant="outline">Add Section</Button>
            </Card>
          ) : (
            sections.map((section) => (
              <Card key={section.id} className="flex items-center justify-between p-4 hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex items-center gap-6">
                  {/* Order Index Block */}
                  <div className="flex flex-col items-center justify-center bg-muted w-12 h-12 rounded-lg border font-bold text-lg text-muted-foreground">
                    #{section.orderIndex}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {section.displayName || section.sectionKey}
                      {!section.isVisible && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Hidden</span>
                      )}
                    </h3>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground font-mono">
                      <span>Key: {section.sectionKey}</span>
                      <span className="text-primary">•</span>
                      <span>Layout: {section.layout}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* 🔥 Parameters, Edit, and Delete Buttons */}
                  <Button size="sm" onClick={() => goToParameterBuilder(section.id)} className="gap-2 mr-4">
                    Parameters <ArrowRight className="w-4 h-4" />
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => handleEditClick(section)} title="Edit Section Settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteClick(section.id, section.displayName || section.sectionKey)} 
                    disabled={isDeletingId === section.id}
                    title="Delete Section"
                  >
                    {isDeletingId === section.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* CREATE / EDIT SECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-lg border-border">
            <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
              <div>
                <CardTitle>{editingSectionId ? 'Edit Section' : 'Add New Section'}</CardTitle>
                <CardDescription>{editingSectionId ? 'Update your section layout properties.' : 'Define layout block for this page.'}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setIsModalOpen(false); setEditingSectionId(null); }}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              
              {apiError && (
                <div className="mb-4 text-xs bg-red-100 text-red-700 p-2 rounded">{apiError}</div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div className="grid gap-2">
                  <Label htmlFor="sectionKey" className="after:content-['*'] after:text-red-500 after:ml-0.5">Section Key (Unique ID)</Label>
                  {/* 🔥 Section Key disabled in Edit Mode */}
                  <Input id="sectionKey" name="sectionKey" value={formData.sectionKey} onChange={handleInputChange} placeholder="e.g. hero-banner-main" required disabled={isCreating || !!editingSectionId} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" name="displayName" value={formData.displayName} onChange={handleInputChange} placeholder="e.g. Main Hero Section" disabled={isCreating} />
                </div>

                <div className="flex gap-4">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="layout" className="after:content-['*'] after:text-red-500 after:ml-0.5">Layout Type</Label>
                    <select 
                      id="layout" 
                      name="layout" 
                      aria-label="Layout Type"
                      value={formData.layout} 
                      onChange={handleInputChange}
                      disabled={isCreating}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="FULLWIDTH">Full Width (Hero)</option>
                      <option value="TWO_COLUMN">Two Column</option>
                      <option value="THREE_COLUMN">Three Column</option>
                      <option value="GRID">Grid (Products)</option>
                      <option value="PORTRAIT">Portrait</option>
                      <option value="HORIZONTAL_BAR">Horizontal Bar (Nav)</option>
                      <option value="HAMBURGER_MENU">Hamburger Menu</option>
                      <option value="STACKED">Stacked (Mobile)</option>
                    </select>
                  </div>

                  <div className="grid gap-2 w-28">
                    <Label htmlFor="orderIndex" className="after:content-['*'] after:text-red-500 after:ml-0.5">Order</Label>
                    <Input id="orderIndex" name="orderIndex" type="number" min="1" value={formData.orderIndex} onChange={handleInputChange} required disabled={isCreating} />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="isVisible" 
                    name="isVisible" 
                    aria-label="Section is Visible"
                    checked={formData.isVisible} 
                    onChange={handleInputChange} 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isVisible" className="cursor-pointer">Section is Visible</Label>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingSectionId(null); }} disabled={isCreating}>Cancel</Button>
                  <Button type="submit" disabled={!formData.sectionKey || isCreating}>
                    {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (editingSectionId ? 'Save Changes' : 'Save Section')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}