// lib/api.ts
import { PageResponse } from '@/types/schema';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreatePageRequest {
  slug: string;
  title: string;
  pageType: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
}

export interface CreateSectionRequest {
  sectionKey: string;
  displayName?: string;
  orderIndex: number;
  layout: string; 
  isVisible?: boolean;
  responsiveConfig?: Record<string, any>;
}
export interface UpdatePageRequest {
  title?: string;
  pageType?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
}

export interface UpdateSectionRequest {
  displayName?: string;
  orderIndex?: number;
  layout?: string;
  isVisible?: boolean;
  responsiveConfig?: Record<string, any>;
}

export interface CreateParameterRequest {
  paramKey: string;
  displayName?: string;
  paramType: string;
  orderIndex: number;
  props: Record<string, any>;
  validationRules?: Record<string, any>;
  responsiveProps?: Record<string, any>;
}

export interface UpdateParameterRequest {
  displayName?: string;
  paramType?: string;
  orderIndex?: number;
  props?: Record<string, any>;
  validationRules?: Record<string, any>;
  responsiveProps?: Record<string, any>;
}
export const pageAPI = {
  /**
   * Fetch page schema by slug/path
   * @param slug - e.g., 'home' or 'admin/products'
   */
  getPageBySlug: async (slug: string): Promise<PageResponse> => {
    // Slashes ko properly handle karne ke liye encode kar rahe hain
    // Taki 'admin/products' -> 'admin%2Fproducts' ban jaye aur backend API break na ho
    const encodedSlug = encodeURIComponent(slug);
    
    // API Call
    const response = await fetch(`${API_BASE_URL}/pages/slug/${encodedSlug}`, {
      // cache: 'no-store' ka matlab hai har request pe fresh data layega (SSR)
      // Jab tum production mein jaoge, isko 'force-cache' ya 'revalidate' kar sakte ho
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Agar page nahi mila (404) ya koi aur error aayi
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('PAGE_NOT_FOUND');
      }
      throw new Error(`Failed to fetch page schema: ${response.statusText}`);
    }

    // JSON ko PageResponse interface ke type mein return kar do
    return response.json();
  },

  /**
   * Fetch all pages for the Admin Dashboard
   * GET /api/pages
   */
  getAllPages: async (): Promise<PageResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/pages`, {
      cache: 'no-store', // Admin dashboard hamesha fresh data dikhayega
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create a new page
   * POST /api/pages
   * @param request - CreatePageRequest data
   */
  createPage: async (request: CreatePageRequest): Promise<PageResponse> => {
    const response = await fetch(`${API_BASE_URL}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Agar Spring Boot se validation error (e.g., 400 Bad Request) aata hai
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to create page: ${response.statusText}`);
    }

    return response.json();
  },
  updatePage: async (pageId: string, request: UpdatePageRequest): Promise<PageResponse> => {
    const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to update page`);
    }
    return response.json();
  },

  deletePage: async (pageId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete page`);
    }
  },
};

export const sectionAPI = {
  /**
   * Get all sections for a specific page
   * GET /api/pages/{pageId}/sections
   */
  getSectionsByPage: async (pageId: string) => {
    const response = await fetch(`${API_BASE_URL}/pages/${pageId}/sections`, {
      cache: 'no-store', // Admin mein live list chahiye
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sections: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Add a new section to a specific page
   * POST /api/pages/{pageId}/sections
   */
  addSection: async (pageId: string, request: CreateSectionRequest) => {
    const response = await fetch(`${API_BASE_URL}/pages/${pageId}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to add section: ${response.statusText}`);
    }
    return response.json();
  },
  updateSection: async (pageId: string, sectionId: string, request: UpdateSectionRequest) => {
    const response = await fetch(`${API_BASE_URL}/pages/${pageId}/sections/${sectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to update section`);
    }
    return response.json();
  },

  // 🔥 NAYA: Delete Section
  deleteSection: async (pageId: string, sectionId: string) => {
    const response = await fetch(`${API_BASE_URL}/pages/${pageId}/sections/${sectionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete section`);
    }
  }
};

export const parameterAPI = {
  /**
   * Get all parameters for a section
   * GET /api/sections/{sectionId}/parameters
   */
  getParametersBySection: async (sectionId: string) => {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/parameters`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch parameters');
    return response.json();
  },

  /**
   * Add a new parameter
   * POST /api/sections/{sectionId}/parameters
   */
  addParameter: async (sectionId: string, request: CreateParameterRequest) => {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/parameters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to add parameter');
    }
    return response.json();
  },

  /**
   * Update parameter
   * PUT /api/sections/{sectionId}/parameters/{parameterId}
   */
  updateParameter: async (sectionId: string, parameterId: string, request: UpdateParameterRequest) => {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/parameters/${parameterId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to update parameter');
    }
    return response.json();
  },

  /**
   * Delete parameter
   * DELETE /api/sections/{sectionId}/parameters/{parameterId}
   */
  deleteParameter: async (sectionId: string, parameterId: string) => {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/parameters/${parameterId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete parameter');
  },
  
  /**
   * Reorder parameter
   * PATCH /api/sections/{sectionId}/parameters/{parameterId}/reorder
   */
  reorderParameter: async (sectionId: string, parameterId: string, newOrder: number) => {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/parameters/${parameterId}/reorder?newOrder=${newOrder}`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to reorder parameter');
    return response.json();
  }
};

