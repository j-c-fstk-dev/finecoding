import { getResources } from '@/lib/resources';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FilterableResourceList } from '@/components/resources/FilterableResourceList';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <section>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Resource Hub
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A curated collection of tools, libraries, and learning materials for developers.
            </p>
          </section>
          <section className="mt-12">
            <FilterableResourceList resources={resources} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
