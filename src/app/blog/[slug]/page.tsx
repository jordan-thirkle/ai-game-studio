import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { posts, getPostBySlug } from "@/data/posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Content is controlled by us in data/posts.ts -- safe for dangerouslySetInnerHTML
  const html = post.content
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
    .split("\n\n")
    .map((block) => {
      if (block.startsWith("<h") || block.startsWith("<li") || block.startsWith("<ul")) {
        if (block.includes("<li>") && !block.startsWith("<ul>")) {
          return "<ul>" + block + "</ul>";
        }
        return block;
      }
      return "<p>" + block + "</p>";
    })
    .join("\n");

  return (
    <>
      <article className="section-container py-24 max-w-3xl">
        <Reveal>
          <Link
            href="/blog"
            className="text-sm text-[var(--color-eigen-green)] hover:text-[var(--color-eigen-bright)] transition-colors no-underline mb-8 inline-block"
          >
            Back to Blog
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <header className="mt-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <time
                dateTime={post.date}
                className="text-xs font-mono text-[var(--color-eigen-muted)]"
              >
                {post.date}
              </time>
              <span className="text-xs text-[var(--color-eigen-muted)]">
                {post.author}
              </span>
            </div>
            <h1 className="text-[var(--color-eigen-cream)] mb-4">{post.title}</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-mono rounded bg-[var(--color-forest-800)] text-[var(--color-eigen-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>
        </Reveal>

        <Reveal delay={200}>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Reveal>

        <Reveal delay={300}>
          <hr className="editorial-divider my-12" />
          <div className="text-center">
            <Link href="/blog" className="btn-secondary">
              More Writing
            </Link>
          </div>
        </Reveal>
      </article>
    </>
  );
}
