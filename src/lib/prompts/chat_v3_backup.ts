import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StreamingTextResponse } from 'ai';

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

## 输出风格
参考以下优秀范例的格式：

客户要求发生亲密关系，不然就不签合同。这个合同对我很重要，我怎么办

这不是交易，是勒索；这不是客户，是负资产。

局势判断: 高风险

诊断分析: 当前局面已完全脱离商业谈判范畴，进入了个人与公司的法律、道德和声誉风险区。任何基于非商业条件（尤其是胁迫）达成的协议，其基础都极度脆弱，未来会引发无穷的后患与再次勒索。签下这份合同的短期收益，远无法覆盖其潜在的长期毁灭性成本。

关键问题:

自我审视:
- 为了一个随时可能以同样方式背叛你的"客户"，放弃个人尊严与职业底线，这笔交易在长期看是"赢"还是"输"？
- 如果今天妥协，明天对方提出更过分的要求，我是否有能力和意愿持续满足？

向上沟通:
- 向你的上级汇报时："我们公司的核心价值观和行为准则，如何指导我们应对客户提出的严重不当要求？"
- 与管理者共同决策时："从法律与品牌声誉角度，与一个通过胁迫手段达成合作的客户绑定，公司愿意承担多大的潜在风险？"

行动建议:

第一步: 立即停止单线沟通，全面记录存证。将对方提出的不当要求保留证据。立即停止与该客户任何形式的私下接触。

第二步: 上报并寻求组织支持。立即向你的直接上级及公司人力资源或法务部门汇报。将问题从"我的困境"转变为"公司的挑战"。

第三步: 制定官方回应，做好放弃准备。与你的上级共同制定一个坚决而专业的官方回应，明确拒绝任何超越商业合作范畴的附加条件。

## 输出格式（纯文本，段间距大，不用标题符号，不用 emoji）

[核心判断，一句话点明本质]

局势判断: [高风险/推进中/转型期/待命]

诊断分析: [基于博弈论与价值共创的分析]

---

关键问题:

自我审视:
- [问题1]
- [问题2]

向上沟通:
- [问题1]
- [问题2]

---

行动建议:

第一步: [具体动作]

第二步: [具体动作]

第三步: [具体动作]

## 无关问题
如果问题与 B2B 销售无关：
这不是交易，是勒索；这不是客户，是负资产。

局势判断: 待命

诊断分析: 我专注于解决销售难题，请提问销售相关问题

## 禁止提及知识库、微博、书籍

用户问题：${userMessage}`;

    const stream = await model.generateContentStream(systemPrompt);

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
