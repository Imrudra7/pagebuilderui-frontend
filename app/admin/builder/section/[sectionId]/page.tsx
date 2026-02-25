'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Plus, Settings, X, Loader2, Component } from 'lucide-react';
import { parameterAPI } from '@/lib/api';

export default function ParameterManagerPage() {
  const params = useParams();
  const router = useRouter();
  const sectionId = params.sectionId as string;

  const [parameters, setParameters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [apiError, setApiError] = useState('');

  const [editingParamId, setEditingParamId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notice: props string format me le rahe hain taaki textarea me likh sakein
  const [formData, setFormData] = useState({
    paramKey: '',
    displayName: '',
    paramType: 'TEXT',
    orderIndex: 1,
    propsString: '{\n  "text": "Example"\n}',
  });

  useEffect(() => {
    if (sectionId) fetchParameters();
  }, [sectionId]);

  const fetchParameters = async () => {
    try {
      setIsLoading(true);
      const data = await parameterAPI.getParametersBySection(sectionId);
      setParameters(data.sort((a: any, b: any) => a.orderIndex - b.orderIndex));
    } catch (error: any) {
      console.error(error);
      setApiError("Failed to load parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    const nextOrder = parameters.length > 0 ? Math.max(...parameters.map(p => p.orderIndex)) + 1 : 1;
    setEditingParamId(null);
    setFormData({
      paramKey: '',
      displayName: '',
      paramType: 'TEXT',
      orderIndex: nextOrder,
      propsString: '{\n  \n}', // Empty JSON object
    });
    setApiError('');
    setIsModalOpen(true);
  };

  const handleEditClick = (param: any) => {
    setEditingParamId(param.id);
    setFormData({
      paramKey: param.paramKey,
      displayName: param.displayName || '',
      paramType: param.paramType || 'TEXT',
      orderIndex: param.orderIndex || 1,
      propsString: JSON.stringify(param.props || {}, null, 2), // JSON ko string me convert kiya
    });
    setApiError('');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseInt(value) || 1 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setApiError('');

      // JSON Validate karo save karne se pehle
      let parsedProps = {};
      try {
        parsedProps = JSON.parse(formData.propsString);
      } catch (err) {
        throw new Error("Invalid JSON format in Props field.");
      }

      const payload = {
        paramKey: formData.paramKey,
        displayName: formData.displayName,
        paramType: formData.paramType,
        orderIndex: formData.orderIndex,
        props: parsedProps,
      };

      if (editingParamId) {
        await parameterAPI.updateParameter(sectionId, editingParamId, payload);
      } else {
        await parameterAPI.addParameter(sectionId, payload as any);
      }

      setIsModalOpen(false);
      fetchParameters();
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = async (paramId: string, paramName: string) => {
    if (window.confirm(`Are you sure you want to delete "${paramName}"?`)) {
      try {
        setIsDeletingId(paramId);
        await parameterAPI.deleteParameter(sectionId, paramId);
        fetchParameters();
      } catch (error: any) {
        alert("Failed to delete parameter");
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 p-8 w-full text-foreground relative">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Section
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parameter Builder</h1>
            <p className="text-muted-foreground mt-1 font-mono text-xs">Section ID: {sectionId}</p>
          </div>
          <Button onClick={handleCreateClick} className="gap-2">
            <Plus className="w-4 h-4" /> Add Parameter
          </Button>
        </div>
      </div>

      {apiError && !isModalOpen && <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{apiError}</div>}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p>Loading parameters...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-5xl">
          {parameters.length === 0 ? (
            <Card className="border-dashed flex flex-col items-center justify-center text-muted-foreground py-16">
              <Component className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium text-lg">No parameters found</p>
              <Button onClick={handleCreateClick} variant="outline" className="mt-4">Add First Parameter</Button>
            </Card>
          ) : (
            parameters.map((param) => (
              <Card key={param.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:border-primary/50 transition-colors shadow-sm gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center bg-muted w-10 h-10 rounded-lg border font-bold text-muted-foreground">
                    #{param.orderIndex}
                  </div>
                  <div>
                    <h3 className="font-semibold text-md flex items-center gap-2">
                      {param.displayName || param.paramKey}
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{param.paramType}</span>
                    </h3>
                    <div className="text-xs text-muted-foreground font-mono mt-1">Key: {param.paramKey}</div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(param)} className="text-xs">
                    <Settings className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(param.id, param.paramKey)} disabled={isDeletingId === param.id} className="text-xs bg-red-500 hover:bg-red-600 text-white">
                    {isDeletingId === param.id ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <X className="w-3.5 h-3.5 mr-1" />} Delete
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* PARAMETER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl shadow-lg border-border max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
              <div>
                <CardTitle>{editingParamId ? 'Edit Parameter' : 'Add New Parameter'}</CardTitle>
                <CardDescription>Configure component details and props.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="pt-6">
              {apiError && <div className="mb-4 text-xs bg-red-100 text-red-700 p-2 rounded">{apiError}</div>}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="paramKey" className="after:content-['*'] after:text-red-500">Parameter Key</Label>
                    <Input id="paramKey" name="paramKey" value={formData.paramKey} onChange={handleInputChange} placeholder="e.g. login_title" required disabled={isCreating || !!editingParamId} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" name="displayName" value={formData.displayName} onChange={handleInputChange} placeholder="e.g. Login Form Title" disabled={isCreating} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="paramType" className="after:content-['*'] after:text-red-500">Component Type</Label>
                    <select id="paramType" aria-label='parameter type is visible' name="paramType" value={formData.paramType} onChange={handleInputChange} disabled={isCreating} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2">
                      <optgroup label="Display Components">
                        <option value="TEXT">Text</option>
                        <option value="IMAGE">Image</option>
                        <option value="SPACER">Spacer</option>
                      </optgroup>
                      <optgroup label="Input Components">
                        <option value="INPUT_TEXT">Input Text</option>
                        <option value="INPUT_EMAIL">Input Email</option>
                        <option value="INPUT_PASSWORD">Input Password</option>
                        <option value="CHECKBOX">Checkbox</option>
                      </optgroup>
                      <optgroup label="Action Components">
                        <option value="BUTTON">Button</option>
                        <option value="LINK">Link</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orderIndex">Order Index</Label>
                    <Input id="orderIndex" name="orderIndex" type="number" value={formData.orderIndex} onChange={handleInputChange} disabled={isCreating} required />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="propsString" className="after:content-['*'] after:text-red-500">Props (JSON Format)</Label>
                  <textarea
                    id="propsString"
                    name="propsString"
                    value={formData.propsString}
                    onChange={handleInputChange}
                    disabled={isCreating}
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder='{"placeholder": "Enter email"}'
                  />
                  <p className="text-[10px] text-input-foreground">Must be valid JSON. E.g.
                    {`
                        {
                          "text": "",
                          "label": "Email",
                          "methods": {
                            "onBlur": {
                              "methodName": "validateField"
                            },
                            "onChange": {
                              "methodName": "onInputChange"
                            }
                          },
                          "variant": "default",
                          "placeholder": "Enter your email address"
                        },
                                                    {
                              "alias": "Login Now",
                              "label": "Login Now",
                              "width": "full",
                              "methods": {
                                "onClick": {
                                  "path": "/auth/login",
                                  "action": "ON_LOGIN_SUBMIT",
                                  "methodName": "executeClick",
                                  "showLoader": true,
                                  "successRedirect": "/dashboard"
                                }
                              },
                              "variant": "default"
                            }
                      
                    `}</p>
                </div>

                <div className="flex justify-end gap-2 mt-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Parameter'}
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