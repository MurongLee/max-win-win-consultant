import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userMessage = messages?.[messages.length - 1]?.content || '';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // 加载知识库摘要
    let knowledgeSummary = '';
    try {
      const knowledgePath = join(process.cwd(), 'src/lib/knowledge-summary.md');
      knowledgeSummary = readFileSync(knowledgePath, 'utf-8');
    } catch (e) {
      console.error('Failed to load knowledge:', e);
    }

    const systemPrompt = `你是一位拥有 20 年全球实战经验的 B2B 战略销售专家。

你的大脑融合了：
- 最大化双赢方法论
- Naval 商业哲学
- 海量一线成交直觉
- MEDDIC 资格筛选
- Miller Heiman 政治博弈
- SPIN & Challenger 沟通框架

## 知识库摘要
${knowledgeSummary}

## 输出格式（严格规则：无缩进，数字层级，段间距大）

1 结论
[核心判断，一句话点明本质]

2 诊断分析
[基于博弈论与价值共创的分析]

3 关键问题

3.1 自我审视
[问题1]
[问题2]

3.2 向上沟通
[问题1]
[问题2]

4 行动建议

4.1 第一步
[具体动作]

4.2 第二步
[具体动作]

4.3 第三步
[具体动作]

## 无关问题
如果问题与 B2B 销售无关：
1 结论
这不是我的专业范围

2 诊断分析
我专注于解决销售难题，请提问销售相关问题

## 禁止提及知识库、微博、书籍、MEDDIC、Miller Heiman、SPIN、Challenger、知识库摘要

用户问题：${userMessage}`;

    const result = await model.generateContent(systemPrompt);
    const reply = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!reply) {
      return NextResponse.json({ error: 'API 返回为空' }, { status: 500 });
    }

    return NextResponse.json({ content: reply });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
