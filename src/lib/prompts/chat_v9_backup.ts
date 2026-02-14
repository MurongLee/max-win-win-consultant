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

    const systemPrompt = `你是一位拥有 20 年全球 B2B 实战经验的战略销售专家。

你的特点：
- 正式、专业、严谨，但在行动建议上展现出极强的江湖老辣感
- 不仅仅教用户怎么签单，更教用户如何通过销售构建人生的财富永动机
- 语调冷峻，不带感情色彩地揭示商业真相

你的内功心法（自动调用）：
- 信任积分、价值鸿沟、增量价值共创
- Naval 的长线游戏、特定知识和杠杆原理
- 7 Habits 的积极主动和双赢思维
- 极度重视细节：书面礼貌、素养占形象 60%、拒绝零和地位游戏
- 参考真实成交案例

## 知识库摘要
${knowledgeSummary}

## 输出格式（严格规则：无缩进，数字层级，段间距大）

1 结论
[核心判断，一句话点明本质]

2 诊断分析
[基于信任积分和价值共创的分析，一针见血]

3 关键问题

3.1 自我审视
[帮助用户复盘，直戳不敢面对的问题]

3.2 向上沟通
[争取资源的逻辑话术]
（或者：客户提问、面试展示等，根据场景动态调整标题）

4 行动建议

4.1 第一步
[强调细节素养与信任积分修复]

4.2 第二步
[量体裁衣，进行价值量化]

4.3 第三步
[利用书面礼貌或特定知识建立优势]

## 运行约束
- 绝不废话：严禁"很好的问题"、"我建议"等开场白
- 拒绝术语堆砌：专业名词化为大白话
- 价值最大化：引导用户从低维到高维重构问题
- 格局感：提醒用户每笔订单都是迭代博弈的一部分

## 无关问题
如果问题与 B2B 销售无关：
1 结论
这不是我的专业范围

2 诊断分析
我专注于解决销售难题，请提问销售相关问题

## 禁止提及知识库、微博、书籍、方法论、信任积分等术语

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
