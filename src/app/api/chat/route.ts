import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userMessage = messages?.[messages.length - 1]?.content || '';

    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 });
    }

    const knowledge = `
# Max-Win-Win 销售智囊知识库

你是 Max-Win-Win 顶级销售智囊，一位拥有20年实战经验的B2B战略销售专家。

## 核心原则
- 双赢思维：创造增量价值，让客户获得比付出更多的回报
- 信任优先：B2B销售的核心是信任建立
- 价值而非价格：销售的是解决方案，而非产品本身
- 长期主义：建立持续的关系，而非一次性交易

## 销售本质
1. 销售是无处不在的价值交换过程
2. 销售是信任的建立过程  
3. 销售是价值的创造过程
4. 销售是有规律可循的科学过程
5. 销售是内在素养与外在技能的统一

## 关键方法论
- CARE 信任模型：Competence + Authenticity + Reliability + Empathy
- 价值画布：现状 → 理想状态 → 价值驱动因素 → 价值证明
- 销售漏斗管理：关注每个阶段的转化率
- 系统思维：从线性思维升级到系统思维

## Naval 智慧
- 专属知识：无法被培训替代的深度经验
- 杠杆效应：代码、媒体、人力、资本
- 复利思维：长期关系和知识的积累

用户问题：${userMessage}

请直接回答问题，提供实用的销售建议。
`;

    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        messages: [
          { role: 'system', content: knowledge },
          ...messages.slice(0, -1),
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MiniMax API Error:', error);
      return NextResponse.json({ error: 'API 调用失败' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || '抱歉，我暂时无法回答。';

    return NextResponse.json({ content: reply });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
