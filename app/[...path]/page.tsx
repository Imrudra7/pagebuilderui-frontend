// app/[...path]/page.tsx
import { pageAPI } from '@/lib/api';
import PageRenderer from '@/components/renderer/PageRenderer';
import { notFound } from 'next/navigation';

interface DynamicPageProps {
  params: Promise<{
    path: string[];
  }>;
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  // 1. FIX: Pehle params Promise ko await/unwrap karo
  const resolvedParams = await params;
  
  // 2. Ab safely array ko string mein convert karo (e.g., 'admin/products' ya 'login')
  const slugPath = resolvedParams.path.join('/');

  try {
    // 3. Spring Boot API call (Server-Side Fetching)
    const pageData = await pageAPI.getPageBySlug(slugPath);

    // 4. Data mil gaya toh Client Renderer ko pass kar do
    return <PageRenderer pageData={pageData} />;
    
  } catch (error: any) {
    // 5. Error Handling
    if (error.message === 'PAGE_NOT_FOUND') {
      notFound(); 
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4 text-center dark:bg-red-950">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Connection Error</h1>
        <p className="mt-2 text-muted-foreground">
          Spring Boot backend se connect nahi ho paaya ya koi error aayi.
        </p>
        <p className="mt-4 rounded bg-red-100 p-2 font-mono text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
          {error.message}
        </p>
      </div>
    );
  }
}