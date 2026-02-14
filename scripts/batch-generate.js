#!/usr/bin/env node
import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `你是一位身经百战的B2B销售幕后操盘手。

你从不掉书袋，不讲理论，只关心两件事：**这个单子能不能赢？怎么赢？**

你的特点：
- 正式，专业、严谨，但输出必须是通俗易懂的大白话
- 冷峻，不带感情色彩地揭示商业真相

## 重要：文件处理规则

当用户上传了文件时，你必须：
1. 认真阅读文件内容，理解用户的问题
2. 如果用户问的是关于文件内容的问题，直接基于文件回答
3. 如果用户让写文档，利用文件内容作为参考

## 核心逻辑

1. **背景 -> 难点 -> 影响 -> 价值**
   - 背景：别废话，先搞清这局里都有谁，发生了什么
   - 难点：客户到底哪儿不爽？
   - 影响（核心！）：如果不解决，客户得赔多少钱？会有多大麻烦？
   - 价值：做成这事儿，对客户个人的好处是什么？

2. **资格审查**：时刻计算经济价值、决策权和决策标准

3. **组织博弈**：区分经济买家，技术买家、教练等角色

## 输出格式

1 结论
[核心判断，一句话点明本质]

2 诊断分析
[基于当前战局的分析，一针见血指出战略缺口或风险点。如果有上传文件，结合文件内容分析]

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

注意：
- 不要用引号或括号来标记假设值，直接写
- 少用中括号

## 运行约束

- 严禁使用销售术语
- 严禁说教
- 必须说人话
- 绝不废话`;

async function generateAnswer(question, model) {
  const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n用户问题：${question}`);
  const reply = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return reply;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('请设置 GEMINI_API_KEY 环境变量');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

  // 读取问题
  const questionsPath = join(process.cwd(), 'src/lib/data/questions.md');
  const questionsContent = readFileSync(questionsPath, 'utf-8');
  
  // 提取问题（按行读取）
  const lines = questionsContent.split('\n');
  const questions = [];
  let currentQuestion = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^\d+[\.、]/) || trimmed.match(/^\*\*\d+[\.、]/)) {
      if (currentQuestion) questions.push(currentQuestion.trim());
      currentQuestion = trimmed.replace(/\*\*/g, '');
    } else if (trimmed && currentQuestion) {
      currentQuestion += ' ' + trimmed;
    }
  }
  if (currentQuestion) questions.push(currentQuestion.trim());
  
  const validQuestions = questions.filter(q => q.length > 10 && !q.includes('###'));
  console.log(`共找到 ${validQuestions.length} 个问题`);
  
  const results = [];
  for (let i = 0; i < validQuestions.length; i++) {
    const q = validQuestions[i];
    console.log(`处理 ${i + 1}/${validQuestions.length}: ${q.substring(0, 40)}...`);
    
    try {
      const answer = await generateAnswer(q, model);
      results.push({ question: q, answer });
      console.log(`  完成`);
    } catch (e) {
      console.error(`  错误: ${e.message}`);
      results.push({ question: q, answer: '生成失败: ' + e.message });
    }
  }
  
  writeFileSync(
    join(process.cwd(), 'src/lib/data/qa-pairs.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );
  
  console.log(`完成！已保存 ${results.length} 个问答对`);
}

main().catch(console.error);
