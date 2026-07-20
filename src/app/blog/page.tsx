import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import matter from "gray-matter";

type BlogFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
};

type BlogPost = BlogFrontmatter & {
  slug: string;
};

const contentDirectory = path.join(process.cwd(), "content/blog");

function getPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  return fs
    .readdirSync(contentDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const filePath = path.join(contentDirectory, fileName);
      const source = fs.readFileSync(filePath, "utf8");
      const { data } = matter(source);

      return {
        slug,
        title: String(data.title),
        date: String(data.date),
        excerpt: String(data.excerpt),
        tags: Array.isArray(data.tags)
          ? data.tags.map(String)
          : [],
      };
    })
    .sort(
      (firstPost, secondPost) =>
        new Date(secondPost.date).getTime() -
        new Date(firstPost.date).getTime(),
    );
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogPage() {
  const posts = getPosts();

  return (
    <main className="min-h-screen bg-[#07130f] text-[#e7efe9]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <header className="max-w-3xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-[#81b29a]">
            Eigen Journal
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#f3f7f4] sm:text-6xl">
            Ideas, process, and perspectives from Eigen Studio.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#9caf9f] sm:text-lg">
            Notes on building meaningful digital experiences, shaping brands,
            and creating work with intention.
          </p>
        </header>

        {posts.length > 0 ? (
          <section
            aria-label="Blog posts"
            className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group flex min-h-[ twentyrem ] flex-col rounded-2xl border border-[#1d382b] bg-[#0c2118] p-6 transition-colors duration-300 hover:border-[#46765b] sm:p-7"
              >
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-[#71917d]">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">Read</span>
                </div>

                <div className="mt-10 flex-1">
                  <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#f0f5f1] transition-colors group-hover:text-[#a8d1b5]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="before:absolute before:inset-0"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-[#9caf9f]">
                    {post.excerpt}
                  </p>
                </div>

                {post.tags.length > 0 ? (
                  <ul className="relative mt-8 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-[#2a4b38] px-3 py-1 text-xs text-[#9fc2aa]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </section>
        ) : (
          <div className="mt-16 rounded-2xl border border-dashed border-[#2a4b38] p-8 text-[#9caf9f]">
            No posts have been published yet.
          </div>
        )}
      </div>
    </main>
  );
}