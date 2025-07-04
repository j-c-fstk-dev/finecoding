import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <section className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About <span className="text-primary">Fine Coding</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Crafting code with purpose and precision.
            </p>
          </section>
          
          <section className="mt-12 prose prose-lg dark:prose-invert max-w-none font-body">
            <Image 
              src="https://res.cloudinary.com/dr0weongo/image/upload/v1751168647/file_00000000591c61f59c33352b1d8f37fd_ncuhov.png"
              alt="A portrait of the author"
              width={800}
              height={400}
              className="rounded-lg object-cover aspect-[2/1]"
              data-ai-hint="portrait author"
            />
            <h2>Our Philosophy</h2>
            <p>
              "Fine Coding" is more than a name—it's a commitment. In a world of fast-paced development cycles and fleeting tech trends, we champion the timeless principles of software craftsmanship. We believe that the best software is not just functional, but also beautiful, maintainable, and a joy to use.
            </p>
            <blockquote>
              <p>We are building a platform for developers who see code as a craft, not just a commodity.</p>
            </blockquote>
            <h2>What You'll Find Here</h2>
            <p>
              This blog is a journey into the heart of modern software development. We explore:
            </p>
            <ul>
              <li><strong>Artificial Intelligence:</strong> Demystifying complex topics and showcasing practical applications of GenAI.</li>
              <li><strong>Software Architecture:</strong> Best practices for building scalable, resilient systems.</li>
              <li><strong>Web Technologies:</strong> Deep dives into frameworks like Next.js, and the art of creating stunning user interfaces.</li>
              <li><strong>Developer Mindset:</strong> Reflections on productivity, career growth, and the philosophy of coding.</li>
            </ul>
            <p>
              This entire blog was built with the principles we advocate, utilizing Next.js, Tailwind CSS, and Firebase, with a design aesthetic inspired by the digital frontier. Welcome to the hub for Fine Coders.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
