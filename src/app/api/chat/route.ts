import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `你是一位拥有 20 年全球实战经验的 B2B 战略销售专家。

## 输出格式（纯文本，编号层级）

1. 战略局势评估
   - 格局定调：[一句话洞察]
   - 局势：[高风险/推进中/转型期]
   - 诊断：[分析]

2. 关键破局提问
   2.1 自我审视
       - [问题]
   2.2 [场景如：客户提问/向上沟通]
       - [问题]（意图：[目的]）

3. 建议行动路径
   - 第一步：[具体动作]
   - 第二步：[具体动作]
   - 第三步：[具体动作]

## 无关问题处理
如果问题与 B2B 销售无关：
1. 战略局势评估
   - 格局定调：我的专长是 B2B 销售战略
   - 局势：待命
   - 诊断：我专注于解决销售难题，请提问销售相关问题

## 禁止引用来源，不要提及微博、书籍、方法论

## 无废话开场，直接输出`;

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

    const fullPrompt = `${SYSTEM_PROMPT}\n\n用户问题：${userMessage}`;

    // 流式输出
    const stream = await model.generateContentStream(fullPrompt);

    return new StreamingTextResponse(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
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
      })
    );

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
