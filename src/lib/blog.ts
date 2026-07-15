import * as fs from 'fs';
import * as path from 'path';

// Use require for gray-matter to avoid TypeScript import issues
const matter = require('gray-matter');

const blogDir = path.join(process.cwd(), 'content/blog');

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  version?: string;
  game?: string;
  previousScore?: number;
  currentScore?: number;
  grade?: string;
  content: string;
};

export function getAllBlogPosts(): BlogPost[] {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  const posts = files.map(file => {
    const slug = file.replace('.md', '');
    const filePath = path.join(blogDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      version: data.version,
      game: data.game,
      previousScore: data.previousScore,
      currentScore: data.currentScore,
      grade: data.grade,
      content,
    };
  });
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(blogDir, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    version: data.version,
    game: data.game,
    previousScore: data.previousScore,
    currentScore: data.currentScore,
    grade: data.grade,
    content,
  };
}

export function getBlogPostsByGame(game: string): BlogPost[] {
  return getAllBlogPosts().filter(post => post.game === game);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return getAllBlogPosts().filter(post => post.tags.includes(tag));
}
