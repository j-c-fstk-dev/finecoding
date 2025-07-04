import { getResources } from '@/lib/resources';
import { FilterableResourceList } from '@/components/resources/FilterableResourceList';
import { WishlistForm } from '@/components/resources/WishlistForm';
import { Separator } from '@/components/ui/separator';

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
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
      <section className="mt-16">
        <Separator className="mb-16" />
        <WishlistForm />
      </section>
    </div>
  );
}
