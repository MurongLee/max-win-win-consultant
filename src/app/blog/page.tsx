import Link from 'next/link';
import { MessageCircle, BookOpen, Users, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog-posts';

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            MAX<span className="text-amber-500">WINWIN</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-amber-500 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> 对话
            </Link>
            <Link href="/blog" className="text-amber-500 font-medium flex items-center gap-1">
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

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">博客</h1>
        <p className="text-gray-500 mb-8">分享 B2B 销售实战洞察与方法论</p>

        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <article key={post.slug} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600">{post.excerpt}</p>
              <div className="flex items-center gap-1 text-amber-500 mt-3 text-sm font-medium">
                阅读全文 <ArrowRight className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 Max-Win-Win. 由 20 年实战经验驱动的 B2B 销售智囊。
        </div>
      </footer>
    </div>
  );
}
