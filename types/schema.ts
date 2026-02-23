// types/schema.ts

// ENUMS (Backend ke hisaab se inki values add/modify kar lena)
// @/types/schema.ts (ya tumhari types file)

export type ParamType = 
  | 'TEXT' | 'IMAGE' | 'VIDEO' | 'ICON' | 'DIVIDER' | 'SPACER' | 'BADGE' // Display
  | 'INPUT_TEXT' | 'INPUT_NUMBER' | 'INPUT_EMAIL' | 'INPUT_PASSWORD'     // Inputs
  | 'TEXTAREA' | 'SELECT' | 'MULTI_SELECT' | 'CHECKBOX' | 'RADIO_GROUP'
  | 'SWITCH' | 'FILE_UPLOAD' | 'DATE_PICKER' | 'COLOR_PICKER' | 'QUANTITY_COUNTER'
  | 'NAV_LINKS' | 'BREADCRUMB' | 'PAGINATION'                            // Navigation
  | 'BUTTON' | 'ICON_BUTTON' | 'LINK'                                    // Actions
  | 'PRODUCT_GRID' | 'PRODUCT_CARD' | 'ORDER_TABLE' | 'STATS_CARD'       // Data
  | 'CHART' | 'CAROUSEL' | 'CARD' | 'SMART_FORM';
export type LayoutType = 'GRID' | 'FLEX' | 'CONTAINER' | 'FULLWIDTH';
export type PageType = 'LANDING' | 'FORM' | 'DASHBOARD' | 'DETAIL';

// 1. Parameter Layer
export interface ParameterResponse {
  id: string; // UUID
  paramKey: string;
  displayName: string;
  paramType: ParamType;
  orderIndex: number;
  props: Record<string, any>;           // Map<String, Object>
  validationRules: Record<string, any>; // Map<String, Object>
  responsiveProps: Record<string, any>; // Map<String, Object>
  createdAt: string; // LocalDateTime
  updatedAt: string; // LocalDateTime
}

// 2. Section Layer
export interface SectionResponse {
  description: any;
  id: string; // UUID
  sectionKey: string;
  displayName: string;
  orderIndex: number;
  layout: LayoutType;
  isVisible: boolean;
  responsiveConfig: Record<string, any>; // Map<String, Object>
  parameters: ParameterResponse[];       // List<ParameterResponse>
  createdAt: string; // LocalDateTime
  updatedAt: string; // LocalDateTime
}

// 3. Page Layer (Parent)
export interface PageResponse {
  id: string; // UUID
  slug: string; // (Note: Backend mein abhi slug hai, tumne pehle path bola tha. Isko path maankar hi treat karenge routing mein)
  title: string;
  pageType: PageType;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  isPublished: boolean;
  sections: SectionResponse[]; // List<SectionResponse>
  createdAt: string; // LocalDateTime
  updatedAt: string; // LocalDateTime
}