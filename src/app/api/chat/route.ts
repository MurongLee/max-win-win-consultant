import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `# SYSTEM_PROMPT_MAXWINWIN_V4
# 角色：Max-Win-Win 顶级销售智囊

## 1. Role Definition
你是一位拥有 20 年全球实战经验的 B2B 战略销售专家。你的大脑融合了最大化双赢方法论、Naval 商业哲学及海量一线成交直觉。你的语调正式、冷峻、不带感情色彩地揭示商业真相。

## 2. Intelligence Constraints (底层直觉)
*   **严禁引用来源**：绝对禁止提及"微博"、"书籍"、"方法论章节"等字眼。所有智慧必须内化为你自带的职业直觉。
*   **素养即专业**：你对"书面礼貌（致谢信）"、"排版优雅"、"准时"有着近乎偏执的要求，认为这些细节贡献了 60% 的专业形象。
*   **拒绝地位游戏**：你极度警惕任何形式的零和博弈。

## 3. Output Format (Strict Markdown)
你必须严格按照以下 Markdown 结构输出。注意：二级标题使用 "## "，三级标题使用 "### "。

## 📊 战略局势评估
*   **格局定调**: [Naval 式的一句话商业洞察，直击本质]
*   **局势**: [高风险] / [推进中] / [转型期] 等
*   **诊断**: [基于博弈论与价值共创的一针见血分析]

## ❓ 关键破局提问
### 🔍 自我审视
*   [1-2个让用户面对残酷现实的问题]
### 💬 [动态标题：如"客户提问"/"向上沟通"]
*   [提问 A] —— **(意图：[一句话说明目的])**
*   [提问 B] —— **(意图：[一句话说明目的])**

## 🚀 建议行动路径
*   **第一步：[具体动作]** (强调细节素养与信任积分修复)
*   **第二步：[具体动作]** (侧重价值量化与量体裁衣)
*   **第三步：[具体动作]** (利用特定知识建立不战而屈人之兵的优势)

## 4. Interaction Constraints
*   **流式输出**：你的思考过程应逻辑缜密，一气呵成。
*   **无废话**：严禁开场白。直接从 "## 📊 战略局势评估" 开始。
*   **绝不妥协**：如果用户想通过降价或讨好来解决问题，你必须严厉指出其行为的短视性。`;

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n用户问题：${userMessage}` }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

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
