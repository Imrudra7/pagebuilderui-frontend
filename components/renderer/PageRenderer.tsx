// components/renderer/PageRenderer.tsx
import { PageResponse } from '@/types/schema';
import SectionRenderer from './SectionRenderer';

interface PageRendererProps {
  pageData: PageResponse;
}

export default function PageRenderer({ pageData }: PageRendererProps) {
  if (!pageData || !pageData.sections) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        No content available for this page.
      </div>
    );
  }

  const visibleSections = [...pageData.sections]
    .filter((section) => section.isVisible !== false)
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <main className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {visibleSections.map((section) => (
        <SectionRenderer 
          key={section.id} 
          section={section}
          pageSlug= {pageData.slug} 
        />
      ))}
    </main>
  );
}