#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `你是一位身经百战的B2B销售幕后操盘手。

你从不掉书袋，不讲理论，只关心两件事：**这个单子能不能赢？怎么赢？**

你的特点：
- 正式，专业、严谨，但输出必须是通俗易懂的大白话
- 冷峻，不带感情色彩地揭示商业真相

## 核心逻辑

1. **背景 -> 难点 -> 影响 -> 价值**
2. **资格审查**：时刻计算经济价值、决策权和决策标准
3. **组织博弈**：区分经济买家，技术买家、教练等角色

## 输出格式

1 结论
[核心判断，一句话点明本质]

2 诊断分析
[基于当前战局的分析，一针见血指出战略缺口或风险点]

3 关键问题

3.1 自我审视
[帮助用户复盘]

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

- 严禁使用销售术语
- 严禁说教
- 必须说人话
- 绝不废话`;

async function generateAnswer(question, model) {
  const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n用户问题：${question}`);
  return result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('请设置 GEMINI_API_KEY');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

  const questionsPath = join(process.cwd(), 'src/lib/data/questions.md');
  const content = readFileSync(questionsPath, 'utf-8');
  
  // 更准确的问题提取：按行遍历，提取问题行及其后续内容
  const lines = content.split('\n');
  const questions = [];
  let currentQuestion = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // 匹配各种编号格式：1. 2. 1) 3.1 等
    if (line.match(/^(\d+[\.、]\s*|[A-Z][\.、]\s*|^\d+\) )/) && line.length > 5) {
      if (currentQuestion) {
        questions.push(currentQuestion.trim());
      }
      // 清理编号，保留问题内容
      currentQuestion = line.replace(/^(\d+[\.、]\s*|[A-Z][\.、]\s*|^\d+\) )/, '').trim();
    } else if (line.match(/^\d+\.\s+/) && line.length > 10) {
      if (currentQuestion) questions.push(currentQuestion.trim());
      currentQuestion = line.replace(/^\d+\.\s+/, '').trim();
    } else if (currentQuestion && line && !line.startsWith('#') && !line.startsWith('---')) {
      currentQuestion += ' ' + line;
    }
  }
  if (currentQuestion) questions.push(currentQuestion.trim());
  
  // 过滤
  const validQuestions = questions.filter(q => {
    const cleaned = q.replace(/^\d+[\.、]\s*/, '').replace(/^[A-Z][\.、]\s*/, '');
    return cleaned.length > 8 && !cleaned.includes('###');
  });
  
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
    JSON.stringify(results, null, 2)
  );
  
  console.log(`完成！已保存 ${results.length} 个问答对`);
}

main().catch(console.error);
