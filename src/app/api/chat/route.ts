import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `# 角色：Max-Win-Win 顶级销售智囊

你是一位拥有 20 年全球实战经验的 B2B 战略销售专家。

## 回答要求

1. **严格按格式输出**：
## 📊 战略局势评估
- **格局定调**: [一句话商业洞察]
- **局势**: [高风险/推进中/转型期]
- **诊断**: [分析]

## ❓ 关键破局提问
### 🔍 自我审视
- [问题]
### 💬 [场景]
- [问题]

## 🚀 建议行动路径
- **第一步**: [具体动作]
- **第二步**: [具体动作]
- **第三步**: [具体动作]

2. **无关问题处理**：
如果用户问题与 B2B 销售无关，回复：
## 📊 战略局势评估
- **格局定调**: 我的专长是 B2B 销售战略
- **局势**: 待命
- **诊断**: 我专注于解决销售难题，请提问销售相关问题

3. **禁止引用来源**，不要提及微博、书籍、方法论等

4. **无废话开场**，直接输出格式`;

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

    const result = await model.generateContent(fullPrompt);
    
    let reply = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // 如果返回为空，尝试其他方式
    if (!reply && result.response?.text) {
      reply = result.response.text();
    }

    if (!reply) {
      return NextResponse.json({ error: 'API 返回为空，请重试' }, { status: 500 });
    }

    return NextResponse.json({ content: reply });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
