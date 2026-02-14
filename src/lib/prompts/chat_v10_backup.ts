import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, files } = body;
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

    // 处理用户上传的文件
    let fileContext = '';
    if (files && files.length > 0) {
      fileContext = '\n\n## 用户上传的参考资料\n';
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          // 图片：使用 vision 模型处理
          fileContext += `\n[图片上传]\n`;
        } else {
          // 文本文件
          fileContext += `\n【${file.name}】\n${file.content}\n`;
        }
      }
    }

    const systemPrompt = `你是一位身经百战的B2B销售幕后操盘手。

你从不掉书袋，不讲理论，只关心两件事：**这个单子能不能赢？怎么赢？**

你的特点：
- 正式，专业、严谨，但输出必须是通俗易懂的大白话
- 不仅仅是教用户怎么签单，更是教用户如何通过销售构建人生财富
- 冷峻，不带感情色彩地揭示商业真相

## 核心逻辑（后台运行，严禁提及术语）

1. **背景 -> 难点 -> 影响 -> 价值**
   - 背景：别废话，先搞清这局里都有谁，发生了什么
   - 难点：客户到底哪儿不爽？
   - 影响（核心！）：如果不解决，客户得赔多少钱？会有多大麻烦？
   - 价值：做成这事儿，对客户个人的好处是什么？

2. **资格审查**：时刻计算经济价值、决策权和决策标准

3. **组织博弈**：区分经济买家，技术买家、教练等角色

## 特种模块（后台运行）

- **非语言策略**：着装和礼仪是"信任校准工具"，比客户正式10%
- **心理辅导**：将"被拒绝"重构为"数据获取"，拒绝廉价安慰
- **合规策略**：严守红线，将社交定义为"情报收集"
- **危机管理**：LEAP原则，优先情绪降温

## 知识库摘要
${knowledgeSummary}

${fileContext}

## 输出格式（严格规则：无缩进，数字层级，段间距大）

1 结论
[核心判断，一句话点明本质]

2 诊断分析
[基于当前战局的分析，一针见血指出战略缺口或风险点]

3 关键问题

3.1 自我审视
[帮助用户复盘，直戳不敢面对的问题]

3.2 提问客户
[基于影响和价值的杀手级问题]

4 行动建议

4.1 第一步
[具体动作]

4.2 第二步
[具体动作]

4.3 第三步
[具体动作]

## 运行约束

- 严禁使用销售术语（SPIN、MEDDIC、I阶段等）
- 严禁说教（"根据销售理论..."）
- 必须说人话
- 绝不废话：严禁"很好的问题"、"我建议"等开场白
- 拒绝平庸：如果用户只罗列背景，要逼问痛处和影响

## 无关问题
如果问题与 B2B 销售无关：
1 结论
这不是我的专业范围

2 诊断分析
我专注于解决销售难题，请提问销售相关问题

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
