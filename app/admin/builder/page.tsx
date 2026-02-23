'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, LayoutTemplate, Settings, X, Loader2 } from 'lucide-react';
import { pageAPI } from '@/lib/api';

export default function BuilderDashboard() {
    const router = useRouter();

    // Real API States
    const [pages, setPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [apiError, setApiError] = useState('');
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    // Modal State & Form Data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        pageType: 'LANDING',
        metaDescription: '',
    });
    const [slugError, setSlugError] = useState('');

    // Fetch Pages on Mount
    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            setIsLoading(true);
            const data = await pageAPI.getAllPages();
            setPages(data);
        } catch (error: any) {
            console.error("Failed to fetch pages:", error);
            setApiError("Spring Boot backend se connect nahi ho paaya.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'slug') {
            const slugRegex = /^[a-z0-9-]+$/;
            if (value && !slugRegex.test(value)) {
                setSlugError('Slug can only contain lowercase letters, numbers, and hyphens');
            } else {
                setSlugError('');
            }
        }
    };

    const handleEditClick = (page: any) => {
        setEditingPageId(page.id);
        setFormData({
            title: page.title,
            slug: page.slug,
            pageType: page.pageType || 'LANDING',
            metaDescription: page.metaDescription || '',
        });
        setSlugError('');
        setApiError('');
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setEditingPageId(null);
        setFormData({ title: '', slug: '', pageType: 'LANDING', metaDescription: '' });
        setSlugError('');
        setApiError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (slugError && !editingPageId) return;

        try {
            setIsCreating(true);
            setApiError('');

            if (editingPageId) {
                await pageAPI.updatePage(editingPageId, {
                    title: formData.title,
                    pageType: formData.pageType,
                    metaDescription: formData.metaDescription,
                });
            } else {
                await pageAPI.createPage({
                    title: formData.title,
                    slug: formData.slug,
                    pageType: formData.pageType,
                    metaDescription: formData.metaDescription,
                });
            }

            setIsModalOpen(false);
            setEditingPageId(null);
            setFormData({ title: '', slug: '', pageType: 'LANDING', metaDescription: '' });
            fetchPages();

        } catch (error: any) {
            console.error("Save page error:", error);
            setApiError(error.message || "Failed to save page.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteClick = async (pageId: string, pageTitle: string) => {
        if (window.confirm(`Are you sure you want to delete "${pageTitle}"? This will delete all its sections and parameters too.`)) {
            try {
                setIsDeletingId(pageId);
                await pageAPI.deletePage(pageId);
                fetchPages();
            } catch (error: any) {
                alert(error.message || "Failed to delete page");
            } finally {
                setIsDeletingId(null);
            }
        }
    };

    const goToSectionManager = (pageId: string) => {
        router.push(`/admin/builder/page/${pageId}`);
    };

    return (
        <div className="min-h-screen bg-muted/10 p-8 w-full text-foreground relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pages Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your Server-Driven UI pages.</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={handleCreateClick} className="gap-2">
                        <Plus className="w-4 h-4" /> Create New Page
                    </Button>
                </div>
            </div>

            {apiError && !isModalOpen && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline">{apiError}</span>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                    <p>Loading pages from Spring Boot...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.map((page) => (
                        <Card key={page.id} className="hover:border-primary/50 transition-colors shadow-sm flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{page.title}</CardTitle>
                                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                                        {page.pageType || 'UNKNOWN'}
                                    </span>
                                </div>
                                <CardDescription className="font-mono text-xs mt-1">/{page.slug}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <LayoutTemplate className="w-4 h-4" />
                                    <span>{page.sections?.length || 0} Sections</span>
                                </div>
                                <div className="flex justify-between items-center w-full mt-auto">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => goToSectionManager(page.id)}
                                    >
                                        Manage Sections
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEditClick(page)} title="Edit Page">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="text-xs px-2"
                                            onClick={() => handleDeleteClick(page.id, page.title)}
                                            disabled={isDeletingId === page.id}
                                            title="Delete Page"
                                        >
                                            {isDeletingId === page.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Card
                        onClick={handleCreateClick}
                        className="border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer min-h-[200px]"
                    >
                        <Plus className="w-8 h-8 mb-2 opacity-50" />
                        <p className="font-medium">Create New Page</p>
                    </Card>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-md shadow-lg border-border">
                        <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
                            <div>
                                <CardTitle>{editingPageId ? 'Edit Page' : 'Create New Page'}</CardTitle>
                                <CardDescription>{editingPageId ? 'Update your page details.' : 'Configure your page details.'}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { setIsModalOpen(false); setEditingPageId(null); }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {apiError && (
                                <div className="mb-4 text-xs bg-red-100 text-red-700 p-2 rounded">
                                    {apiError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="after:content-['*'] after:text-red-500 after:ml-0.5">Page Title</Label>
                                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Summer Sale" required disabled={isCreating} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug" className="after:content-['*'] after:text-red-500 after:ml-0.5">URL Slug</Label>
                                    <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="e.g. summer-sale" required disabled={isCreating || !!editingPageId} />
                                    {slugError && !editingPageId && (
                                        <p className="text-xs text-red-500 font-medium">{slugError}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pageType" className="after:content-['*'] after:text-red-500 after:ml-0.5">Page Type</Label>
                                    <select
                                        id="pageType"
                                        name="pageType"
                                        aria-label="Page Type"
                                        value={formData.pageType}
                                        onChange={handleInputChange}
                                        disabled={isCreating}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="LANDING">Landing Page</option>
                                        <option value="FORM">Form / Auth Page</option>
                                        <option value="DETAIL">Product Detail Page</option>
                                        <option value="CART">Shopping Cart</option>
                                        <option value="DASHBOARD">Admin Dashboard</option>
                                        <option value="CUSTOM">Custom Flexible Page</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="metaDescription">Meta Description (Optional)</Label>
                                    <Input id="metaDescription" name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} placeholder="Brief SEO description..." disabled={isCreating} />
                                </div>
                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                    <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingPageId(null); }} disabled={isCreating}>Cancel</Button>
                                    <Button type="submit" disabled={(!!slugError && !editingPageId) || !formData.title || !formData.slug || isCreating}>
                                        {isCreating ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                        ) : (
                                            editingPageId ? 'Save Changes' : 'Create Page'
                                        )}
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