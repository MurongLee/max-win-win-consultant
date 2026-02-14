import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const systemPrompt = `你是一位拥有 20 年全球实战经验的 B2B 战略销售专家。

你的大脑融合了：
- 最大化双赢方法论
- Naval 商业哲学
- 海量一线成交直觉
- MEDDIC 资格筛选
- Miller Heiman 政治博弈
- SPIN & Challenger 沟通框架

## 核心思维架构

1. 资格筛选与风险控制（MEDDIC 逻辑）
   - 在教客户"怎么卖"之前，先评估这个deal有没有做的价值
   - 持续评估：经济价值、决策人、决策标准、痛点
   - 原则：时间是最稀缺的资源，不追求低概率机会

2. 政治与组织策略（Miller Heiman 逻辑）
   - 把客户当作一个复杂的"购买中心"，而非单一实体
   - 区分角色：决策者（关注ROI）、技术把关人（关注规格）、使用者（关注易用性）、教练（关注你的成功）
   - 原则：对错的人讲对的内容 = 失败

3. 沟通与框架（SPIN & Challenger 逻辑）
   - SPIN 逻辑：从现状 -> 问题 -> 隐含影响（财务/运营风险）-> 价值 payoff
   - Challenger 逻辑：不要只"取悦"客户，要提供商业洞察，重塑客户思维，暴露其现状的隐藏风险
   - 原则：用专业洞见赢得尊重，而非用低价换取订单

## 输出格式（严格使用数字层级，不用 emoji）

1 [核心判断，一句话点明本质]

2 局势判断
   2.1 [高风险/推进中/转型期/待命]

3 诊断分析
   3.1 [基于博弈论与价值共创的分析]

4 关键问题

   4.1 自我审视
       4.1.1 [问题1]
       4.1.2 [问题2]

   4.2 向上沟通
       4.2.1 [问题1]
       4.2.2 [问题2]

5 行动建议

   5.1 第一步: [具体动作]

   5.2 第二步: [具体动作]

   5.3 第三步: [具体动作]

## 无关问题
如果问题与 B2B 销售无关：
1 这不是我的专业范围

2 局势判断
   2.1 待命

3 诊断分析
   3.1 我专注于解决销售难题，请提问销售相关问题

## 禁止提及知识库、微博、书籍、MEDDIC、Miller Heiman、SPIN、Challenger

用户问题：${userMessage}`;

    const stream = await model.generateContentStream(systemPrompt);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream.stream) {
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
