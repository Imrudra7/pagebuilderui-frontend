// app/test/page.tsx
import { PageResponse } from '@/types/schema';
import PageRenderer from '@/components/renderer/PageRenderer';

// Ye wahi JSON hai jo future mein Spring Boot API se aayega
const mockPageData: PageResponse = {
  id: "page-123",
  slug: "test-home",
  title: "Test Builder Page",
  pageType: "LANDING",
  metaDescription: "Testing our SDUI engine",
  metaKeywords: "nextjs, sdui, pagebuilder",
  ogImage: "",
  isPublished: true,
  createdAt: "2026-02-21T10:00:00",
  updatedAt: "2026-02-21T10:00:00",
  sections: [
    {
      id: "sec-1",
      sectionKey: "hero-section",
      displayName: "Hero Section",
      orderIndex: 1,
      layout: "CONTAINER",
      isVisible: true,
      responsiveConfig: {},
      createdAt: "2026-02-21T10:00:00",
      updatedAt: "2026-02-21T10:00:00",
      parameters: [
        {
          id: "param-1",
          paramKey: "hero-title",
          displayName: "Welcome to Universal Page Builder",
          paramType: "TEXT",
          orderIndex: 1,
          props: { variant: "h1" },
          validationRules: {},
          responsiveProps: {},
          createdAt: "2026-02-21T10:00:00",
          updatedAt: "2026-02-21T10:00:00"
        },
        {
          id: "param-2",
          paramKey: "hero-subtitle",
          displayName: "This UI is 100% generated from JSON data. No hardcoded layouts!",
          paramType: "TEXT",
          orderIndex: 2,
          props: { variant: "p" },
          validationRules: {},
          responsiveProps: {},
          createdAt: "2026-02-21T10:00:00",
          updatedAt: "2026-02-21T10:00:00"
        },
        {
          id: "param-3",
          paramKey: "hero-cta",
          displayName: "Get Started",
          paramType: "BUTTON",
          orderIndex: 3,
          props: { variant: "default", size: "lg", actionUrl: "/signup" },
          validationRules: {},
          responsiveProps: {},
          createdAt: "2026-02-21T10:00:00",
          updatedAt: "2026-02-21T10:00:00"
        }
      ]
    },
    {
      id: "sec-2",
      sectionKey: "form-section",
      displayName: "Signup Form",
      orderIndex: 2,
      layout: "GRID", // Grid layout test karne ke liye
      isVisible: true,
      responsiveConfig: {},
      createdAt: "2026-02-21T10:00:00",
      updatedAt: "2026-02-21T10:00:00",
      parameters: [
        {
          id: "param-4",
          paramKey: "email-input",
          displayName: "Email Address",
          paramType: "INPUT",
          orderIndex: 1,
          props: { inputType: "email", placeholder: "john@example.com" },
          validationRules: { required: true },
          responsiveProps: {},
          createdAt: "2026-02-21T10:00:00",
          updatedAt: "2026-02-21T10:00:00"
        },
        {
          id: "param-5",
          paramKey: "password-input",
          displayName: "Password",
          paramType: "INPUT",
          orderIndex: 2,
          props: { inputType: "password", placeholder: "••••••••" },
          validationRules: { required: true },
          responsiveProps: {},
          createdAt: "2026-02-21T10:00:00",
          updatedAt: "2026-02-21T10:00:00"
        }
      ]
    }
  ]
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Humara engine yahan call ho raha hai */}
      <PageRenderer pageData={mockPageData} />
    </div>
  );
}