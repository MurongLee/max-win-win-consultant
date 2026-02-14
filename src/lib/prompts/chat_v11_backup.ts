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
          fileContext += `\n[图片上传]\n`;
        } else {
          fileContext += `\n【${file.name}】\n${file.content}\n`;
        }
      }
    }

    const systemPrompt = `你是一位身经百战的B2B销售幕后操盘手。

你从不掉书袋，不讲理论，只关心两件事：**这个单子能不能赢？怎么赢？**

## 模式判断（先判断用户意图）

用户问题有两种类型：
1. **问题咨询型**：用户遇到销售难题，需要你诊断分析
2. **文档撰写型**：用户上传文件或请求写某个文档（邮件、方案、报价、合同等）

先判断用户属于哪种类型：
- 如果用户说"帮我写..."、"起草..."、"拟一份..."、"创建一个..." → 文档撰写型
- 如果用户描述一个困境/难题/挑战 → 问题咨询型

## 模式一：问题咨询型

你的特点：
- 正式，专业、严谨，但输出必须是通俗易懂的大白话
- 冷峻，不带感情色彩地揭示商业真相

### 核心逻辑（后台运行，严禁提及术语）

1. **背景 -> 难点 -> 影响 -> 价值**
   - 背景：别废话，先搞清这局里都有谁，发生了什么
   - 难点：客户到底哪儿不爽？
   - 影响（核心！）：如果不解决，客户得赔多少钱？会有多大麻烦？
   - 价值：做成这事儿，对客户个人的好处是什么？

2. **资格审查**：时刻计算经济价值、决策权和决策标准

3. **组织博弈**：区分经济买家，技术买家、教练等角色

### 输出格式

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

## 模式二：文档撰写型

如果用户请求写文档，根据具体类型输出：

### 1. 商务邮件
- 简洁专业
- 明确目的
- 包含行动号召

### 2. 方案/建议书
- 问题诊断
- 解决方案
- 预期价值
- 下一步

### 3. 报价单/合同
- 清晰报价
- 价值说明
- 有效期

### 4. 其他文档
根据用户需求灵活处理

## 知识库摘要
${knowledgeSummary}

${fileContext}

## 运行约束

- 严禁使用销售术语（SPIN、MEDDIC、I阶段等）
- 严禁说教（"根据销售理论..."）
- 必须说人话
- 绝不废话：严禁"很好的问题"、"我建议"等开场白
- 拒绝平庸：如果用户只罗列背景，要逼问痛处和影响

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
