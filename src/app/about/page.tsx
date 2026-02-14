import Link from 'next/link';
import { MessageCircle, BookOpen, Users } from 'lucide-react';

export default function About() {
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
            <Link href="/about" className="text-amber-500 font-medium flex items-center gap-1">
              <Users className="w-4 h-4" /> 关于
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-amber-500">
              联系
            </Link>
          </nav>
        </div>
      </header>

      {/* About Content */}
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">关于 Max-Win-Win</h1>

        <div className="prose max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">我们是谁</h2>
            <p className="text-gray-600 leading-relaxed">
              Max-Win-Win 是一个基于 20 年 B2B 实战经验构建的销售智囊。我们将一线销售冠军的直觉、全球销售经典的智慧、以及经过验证的方法论，转化为可复用的 AI 能力。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">背后的真东西</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span><strong>13 本全球销售经典</strong>：从《挑战式销售》到《SPIN销售》，从《高效能人士的七个习惯》到 Naval 智慧</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span><strong>1,442 条一线成交直觉</strong>：来自真实销售场景的实战洞察</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span><strong>14 章实战方法论</strong>：从销售本质到信任建立，从价值创造到系统思维</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span><strong>11 组深度问答对</strong>：覆盖 B2B 销售的核心场景</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">核心理念</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-2">双赢思维</h3>
                <p className="text-gray-600 text-sm">真正的最大化双赢，是发现那些客户自己都还没意识到的增量价值。</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-2">信任优先</h3>
                <p className="text-gray-600 text-sm">B2B 决策具有高风险、长周期、多决策者的特征，信任是唯一的交易加速器。</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-2">长期主义</h3>
                <p className="text-gray-600 text-sm">将销售活动视为持续价值旅程的第一步，而非一个独立交易事件的终点。</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-2">系统思维</h3>
                <p className="text-gray-600 text-sm">线性思维者在解决症状，系统思维者在解决根源。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">适合谁</h2>
            <p className="text-gray-600 leading-relaxed">
              如果你是 B2B 销售从业者，正在面对复杂的客户决策链、漫长的销售周期、或激烈的价格竞争，Max-Win-Win 可以帮助你从更高的视角审视局势，找到突破点。
            </p>
          </section>
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
