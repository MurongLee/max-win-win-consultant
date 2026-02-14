import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle, BookOpen, Users, ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog-posts';

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            MAX<span className="text-amber-500">WINWIN</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-amber-500 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> 对话
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-amber-500 flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> 博客
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-amber-500 flex items-center gap-1">
              <Users className="w-4 h-4" /> 关于
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-amber-500">
              联系
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <main className="max-w-3xl mx-auto py-12 px-4">
        <Link href="/blog" className="flex items-center gap-1 text-gray-500 hover:text-amber-500 mb-6">
          <ArrowLeft className="w-4 h-4" /> 返回博客
        </Link>

        <article>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
              {post.category}
            </span>
            <span>{post.date}</span>
          </div>

          <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 Max-Win-Win. 由 20 年实战经验驱动的 B2B 销售智囊。
        </div>
      </footer>
    </div>
  );
}
