import Link from 'next/link';
import { MessageCircle, BookOpen, Users, ArrowRight } from 'lucide-react';

export default function Blog() {
  const posts = [
    {
      title: '销售是信任的建立过程',
      excerpt: '在 B2B 销售中，信任是唯一的交易加速器。客户购买的不仅是产品，更是一份确定性。',
      category: '方法论',
      date: '2026-02-01'
    },
    {
      title: '终结价格战：价值重构逻辑',
      excerpt: '当客户说你们报价太高时，这通常是一个信号，表明你未能将产品的价值转化为客户愿意买单的业务收益。',
      category: '方法论',
      date: '2026-01-28'
    },
    {
      title: '从推销者到价值伙伴的身份转变',
      excerpt: '价值伙伴是与客户共同探索业务挑战、定义成功标准并实现价值的专业角色。',
      category: '思维模式',
      date: '2026-01-25'
    },
    {
      title: '长期主义视角下的销售行为设计',
      excerpt: '将销售活动视为持续价值旅程的第一步，而非一个独立交易事件的终点。',
      category: '思维模式',
      date: '2026-01-20'
    },
    {
      title: 'Naval 智慧：专属知识与杠杆效应',
      excerpt: '专属知识是无法通过简单培训习得的，它是你在职场中的护城河。',
      category: '深度思考',
      date: '2026-01-15'
    },
    {
      title: 'B2B 销售的系统思维',
      excerpt: '线性思维者在解决症状，系统思维者在解决根源。',
      category: '方法论',
      date: '2026-01-10'
    }
  ];

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
          {posts.map((post, i) => (
            <article key={i} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
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
