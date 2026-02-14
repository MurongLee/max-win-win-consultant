import Link from 'next/link';
import Chat from '@/components/Chat';
import { BookOpen, MessageCircle, Users } from 'lucide-react';

export default function Home() {
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
            <Link href="/blog" className="text-gray-600 hover:text-amber-500 flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> 博客
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-amber-500 flex items-center gap-1">
              <Users className="w-4 h-4" /> 关于
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-amber-500 flex items-center gap-1">
              联系
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px]">
          <Chat />
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
