'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, BookOpen, Users, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 简化处理：显示提交成功
    setSubmitted(true);
  };

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
            <Link href="/contact" className="text-amber-500 font-medium">
              联系
            </Link>
          </nav>
        </div>
      </header>

      {/* Contact Content */}
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">联系我们</h1>
        <p className="text-gray-500 mb-8">有任何问题或建议，欢迎留言</p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-700 mb-2">提交成功</h2>
            <p className="text-gray-600">感谢你的留言，我们会尽快回复。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="你的名字"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">留言</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="写下你的问题或建议..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> 提交
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-semibold mb-4">其他联系方式</h3>
          <p className="text-gray-600 text邮箱：contact@maxwinwin-sm">
            .com<br />
           微信：MaxWinWin_AI
          </p>
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
