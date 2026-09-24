import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/home/Hero";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getFeaturedPosts } from "@/lib/mdx";
import { getFeaturedProjects } from "@/lib/projects";
import { blogCollectionJsonLd, jsonLdToString } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    getFeaturedPosts(3),
    getFeaturedProjects(4),
  ]);

  return (
    <Container>
      <Hero />
      <ProjectGrid projects={projects} />
      <LatestPosts posts={posts} />
      <ContactCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToString(blogCollectionJsonLd(posts, "Latest writing", "/")),
        }}
      />
    </Container>
  );
}
